import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { Order } from '@/types';

const STORAGE_KEY = 'orders';

async function readOrders(): Promise<Order[]> {
  try {
    let orders = storage.get(STORAGE_KEY);
    
    if ((!orders || !Array.isArray(orders)) && 
        process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = require('@vercel/kv');
        orders = await kv.get(STORAGE_KEY);
        if (orders && Array.isArray(orders)) {
          storage.set(STORAGE_KEY, orders);
          return orders;
        }
      } catch (e) {
        console.error('Error loading orders from KV:', e);
      }
    }
    
    if (Array.isArray(orders)) {
      return orders;
    }
  } catch (error) {
    console.error('Error reading orders:', error);
  }
  storage.set(STORAGE_KEY, []);
  return [];
}

function saveOrders(orders: Order[]): void {
  try {
    storage.set(STORAGE_KEY, orders);
    
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = require('@vercel/kv');
      kv.set(STORAGE_KEY, orders).catch((e: any) => {
        console.error('Error saving orders to KV:', e);
      });
    }
  } catch (error) {
    console.error('Error saving orders:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const orders = await readOrders();
    return NextResponse.json({ 
      success: true, 
      orders,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orders, order, id, status } = body;

    // Nếu có orders array, thay thế toàn bộ
    if (Array.isArray(orders)) {
      saveOrders(orders);
      return NextResponse.json({ 
        success: true, 
        message: 'Orders saved successfully',
        timestamp: new Date().toISOString()
      });
    }

    // Nếu có order object, thêm vào danh sách
    if (order) {
      const currentOrders = await readOrders();
      const orderId = order.id || order.orderId || `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newOrder: Order = {
        orderId: orderId,
        id: orderId, // Alias for backward compatibility
        packageId: order.packageId || order.planId,
        planId: order.planId || order.packageId,
        packageName: order.packageName || order.planName,
        planName: order.planName || order.packageName,
        carrier: order.carrier,
        price: order.price || order.amount || 0,
        amount: order.amount || order.price || 0,
        paymentMethod: order.paymentMethod || 'bank',
        status: order.status || 'pending',
        customerName: order.customerName || order.name,
        customerEmail: order.customerEmail || order.email,
        customerPhone: order.customerPhone || order.phone,
        customerAddress: order.customerAddress,
        customerNotes: order.customerNotes || order.notes,
        name: order.name || order.customerName,
        email: order.email || order.customerEmail,
        phone: order.phone || order.customerPhone,
        notes: order.notes || order.customerNotes,
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRead: false,
      };
      const updatedOrders = [...currentOrders, newOrder];
      saveOrders(updatedOrders);
      return NextResponse.json({ 
        success: true, 
        message: 'Order added successfully',
        order: newOrder,
        timestamp: new Date().toISOString()
      });
    }

    // Nếu có id và status, cập nhật order
    if (id && status) {
      const orders = await readOrders();
      const updatedOrders = orders.map((o: Order) => 
        (o.id === id || o.orderId === id) ? { ...o, status, updatedAt: new Date().toISOString() } : o
      );
      saveOrders(updatedOrders);
      return NextResponse.json({ 
        success: true, 
        message: 'Order updated successfully',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save orders' },
      { status: 500 }
    );
  }
}
