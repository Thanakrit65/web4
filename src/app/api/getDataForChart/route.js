import { NextResponse } from 'next/server';
import { mysqlPool } from '../../utils/db.js';// ปรับให้เข้ากับที่อยู่ของ db.js ของคุณ

export async function POST(req) {
  const promisePool = mysqlPool.promise();

  try {
    const [results] = await promisePool.query('SELECT * FROM us_covid_data.us_all where date between \'2023-01-01\' and \'2023-12-30\' limit 10;');
    const transformDatesMethod1 = (data) => {
      return data.map(item => ({
        ...item,
        date: new Date(item.date).toISOString().split('T')[0]
      }));
    };
    const transformedData1 = transformDatesMethod1(results);
    console.log(transformedData1)
    return NextResponse.json(transformedData1);
  } catch (error) {
    console.error(error);
    return req.status(500).json({ message: 'Error fetching data' });
  }

}
