import { NextResponse } from "next/server";

export async function POST(req){
  try{
    const body = await req.json();
    const res = await fetch("https://tm-web.techmax.lk/online-users/reset-password-web", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const response = await res.json();
    if (response.error) {
      return new NextResponse("Data error", {status: 400});
    } 
    else {
      return NextResponse.json(response);
    }
  }
  catch(error){
    return new NextResponse("Internal error", {status: 500});
  }
}