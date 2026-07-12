import { NextRequest, NextResponse } from 'next/server';
import { Package } from '@/types';
import { defaultPackages } from '@/lib/data';
import { storage } from '@/lib/storage';

const STORAGE_KEY = 'packages';

async function readPackages(): Promise<Package[]> {
  try {
    let packages = storage.get(STORAGE_KEY);
    
    // Try to load from KV if local storage is empty
    if ((!packages || !Array.isArray(packages) || packages.length === 0) && 
        process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = require('@vercel/kv');
        packages = await kv.get(STORAGE_KEY);
        if (packages && Array.isArray(packages) && packages.length > 0) {
          storage.set(STORAGE_KEY, packages);
          console.log(`✅ Loaded ${packages.length} packages from KV`);
          return packages;
        }
      } catch (e) {
        console.error('Error loading packages from KV:', e);
      }
    }
    
    // If we have packages from storage, return them (don't reset to default)
    if (packages && Array.isArray(packages) && packages.length > 0) {
      console.log(`✅ Loaded ${packages.length} packages from storage`);
      return packages;
    }
    
    // Only use default packages if storage is completely empty (first time setup)
    console.log('⚠️ No packages found, using default packages');
    storage.set(STORAGE_KEY, defaultPackages);
    
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = require('@vercel/kv');
        await kv.set(STORAGE_KEY, defaultPackages);
        console.log('✅ Default packages saved to Vercel KV');
      } catch (e) {
        console.error('Error saving packages to KV:', e);
      }
    }
    
    return defaultPackages;
  } catch (error) {
    console.error('Error reading packages:', error);
    // Fallback to default only on error
    return defaultPackages;
  }
}

async function savePackages(packages: Package[]): Promise<void> {
  try {
    storage.set(STORAGE_KEY, packages);
    
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = require('@vercel/kv');
        await kv.set(STORAGE_KEY, packages);
        console.log('Packages saved to Vercel KV');
      } catch (e) {
        console.error('Error saving packages to KV:', e);
      }
    }
  } catch (error) {
    console.error('Error saving packages:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const packages = await readPackages();
    return NextResponse.json({ 
      success: true, 
      packages,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in GET /api/packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read packages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packages } = body;

    if (!Array.isArray(packages)) {
      return NextResponse.json(
        { success: false, error: 'Invalid packages data' },
        { status: 400 }
      );
    }

    await savePackages(packages);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Packages saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in POST /api/packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save packages' },
      { status: 500 }
    );
  }
}
