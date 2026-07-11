'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package } from '@/types';
import { defaultPackages } from './data';

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>(defaultPackages);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchPackagesFromServer = useCallback(async () => {
    try {
      const response = await fetch(`/api/packages?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.packages)) {
          setPackages(data.packages);
          setLastUpdate(new Date());
          if (typeof window !== 'undefined') {
            localStorage.setItem('packages', JSON.stringify(data.packages));
            localStorage.setItem('packagesLastUpdate', new Date().toISOString());
          }
          return true;
        }
      }
    } catch (error) {
      console.error('Error fetching packages from server:', error);
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('packages');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPackages(parsed);
              return false;
            }
          } catch (e) {
            console.error('Error loading from cache:', e);
          }
        }
      }
    }
    return false;
  }, []);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const loadPackages = async () => {
      setIsLoading(true);
      await fetchPackagesFromServer();
      if (isMounted) {
        setIsLoading(false);
      }
    };

    loadPackages();

    pollInterval = setInterval(async () => {
      if (isMounted) {
        await fetchPackagesFromServer();
      }
    }, 3000);

    const handlePackagesUpdated = () => {
      if (isMounted) {
        fetchPackagesFromServer();
      }
    };

    window.addEventListener('packagesUpdated', handlePackagesUpdated);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'packages' && isMounted) {
        fetchPackagesFromServer();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      window.removeEventListener('packagesUpdated', handlePackagesUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchPackagesFromServer]);

  return packages;
}

export async function savePackagesToServer(packages: Package[]): Promise<boolean> {
  try {
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ packages }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('packages', JSON.stringify(packages));
          localStorage.setItem('packagesLastUpdate', new Date().toISOString());
        }
        notifyPackagesUpdated();
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error saving packages to server:', error);
    return false;
  }
}

export function notifyPackagesUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('packagesUpdated'));
    const event = new StorageEvent('storage', {
      key: 'packages',
      newValue: localStorage.getItem('packages'),
    });
    window.dispatchEvent(event);
  }
}
