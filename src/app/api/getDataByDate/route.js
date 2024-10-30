import { NextResponse } from 'next/server';
import { mysqlPool } from '../../utils/db.js';// ปรับให้เข้ากับที่อยู่ของ db.js ของคุณ

export async function POST(req) {
  const promisePool = mysqlPool.promise();
  const { date } = await req.json();

  try {
    const [results] = await promisePool.query('SELECT cases, deaths FROM us_covid_data.us_all WHERE date = ?', [date]);
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return req.status(500).json({ message: 'Error fetching data' });
  }

}
