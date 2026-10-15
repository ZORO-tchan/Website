import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface ServiceOrder {
  orderId: string;
  timestamp: string;
  name: string;
  phone: string;
  deviceBrand: string;
  deviceModel: string;
  faultCategory: string;
  issueDescription: string;
  previousRepairAttempt: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const timestamp = new Date().toISOString();
    const orderId = `H55-${Date.now().toString().slice(-6)}`;

    const orderRecord: ServiceOrder = {
      orderId,
      timestamp,
      ...data,
    };

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "service_requests.json");
    let existing: ServiceOrder[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existing = JSON.parse(fileContent);
      } catch {
        existing = [];
      }
    }

    existing.unshift(orderRecord);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      orderId,
      message: "تم حفظ طلب الصيانة بنجاح في قاعدة بيانات الموقع",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "تعذر حفظ الطلب" },
      { status: 500 }
    );
  }
}
