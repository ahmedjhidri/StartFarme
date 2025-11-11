import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth';
import { cache } from '../config/redis';

// Get market prices
export const getMarketPrices = async (req: Request, res: Response) => {
  try {
    const { product } = req.query;

    // Check cache
    const cacheKey = `market:prices:${product || 'all'}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Get prices from database
    const where = product ? { product: product as string } : {};

    const prices = await prisma.marketPrice.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 100,
    });

    // Group by product
    const groupedPrices = prices.reduce((acc: any, price) => {
      if (!acc[price.product]) {
        acc[price.product] = {
          product: price.product,
          productAr: price.productAr,
          category: price.category,
          unit: price.unit,
          prices: [],
          priceHistory: [],
        };
      }
      acc[price.product].prices.push({
        market: price.marketName,
        priceMin: price.priceMin,
        priceMax: price.priceMax,
        priceAvg: price.priceAvg,
        date: price.date,
      });
      return acc;
    }, {});

    const result = Object.values(groupedPrices);

    // Cache for 1 hour
    await cache.set(cacheKey, JSON.stringify(result), 3600);
    res.json(result);
  } catch (error: any) {
    console.error('Get market prices error:', error);
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
};

// Get price history
export const getPriceHistory = async (req: Request, res: Response) => {
  try {
    const { product, days = 30 } = req.query;

    if (!product) {
      return res.status(400).json({ error: 'Product is required' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const prices = await prisma.marketPrice.findMany({
      where: {
        product: product as string,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    const priceHistory = prices.map((price) => ({
      date: price.date,
      price: price.priceAvg,
    }));

    res.json(priceHistory);
  } catch (error: any) {
    console.error('Get price history error:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
};

// Get listings
export const getListings = async (req: Request, res: Response) => {
  try {
    const { product, category, location, minPrice, maxPrice, status } = req.query;

    const where: any = {
      status: status || 'AVAILABLE',
    };

    if (product) where.product = { contains: product as string, mode: 'insensitive' };
    if (category) where.category = category as string;
    if (location) where.location = { contains: location as string, mode: 'insensitive' };
    if (minPrice) where.pricePerUnit = { gte: parseFloat(minPrice as string) };
    if (maxPrice) {
      where.pricePerUnit = {
        ...where.pricePerUnit,
        lte: parseFloat(maxPrice as string),
      };
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        farmer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json(listings);
  } catch (error: any) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

// Create listing
export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      product,
      productAr,
      quantity,
      unit,
      pricePerUnit,
      negotiable,
      location,
      harvestDate,
      quality,
      photos,
      description,
    } = req.body;

    if (!product || !quantity || !unit || !pricePerUnit || !location || !harvestDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const listing = await prisma.listing.create({
      data: {
        farmerId: req.user.userId,
        product,
        productAr: productAr || product,
        quantity: parseFloat(quantity),
        unit,
        pricePerUnit: parseFloat(pricePerUnit),
        negotiable: negotiable !== false,
        location,
        harvestDate: new Date(harvestDate),
        quality: quality || 'GRADE_A',
        photos: photos || [],
        description,
        status: 'AVAILABLE',
      },
    });

    res.status(201).json(listing);
  } catch (error: any) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

// Update listing
export const updateListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if listing belongs to user
    const existingListing = await prisma.listing.findFirst({
      where: {
        id,
        farmerId: req.user.userId,
      },
    });

    if (!existingListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.harvestDate && { harvestDate: new Date(updateData.harvestDate) }),
        ...(updateData.quantity && { quantity: parseFloat(updateData.quantity) }),
        ...(updateData.pricePerUnit && { pricePerUnit: parseFloat(updateData.pricePerUnit) }),
      },
    });

    res.json(listing);
  } catch (error: any) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
};

// Delete listing
export const deleteListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Check if listing belongs to user
    const existingListing = await prisma.listing.findFirst({
      where: {
        id,
        farmerId: req.user.userId,
      },
    });

    if (!existingListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await prisma.listing.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error: any) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};

