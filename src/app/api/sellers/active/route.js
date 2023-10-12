import { NextResponse } from "next/server";

export async function POST(req){
  try{
    const body = await req.json();
    const res = await fetch(" http://localhost:8000/online-users/active-sellers-web", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const response = await res.json();
    console.log(response);
    if (response.error) {
      return new NextResponse("Data error", {status: 400});
    } 
    else {
      return NextResponse.json(response);
    }
  }
  catch(error){
    console.log(error);
    return new NextResponse("Internal error", {status: 500});
  }
}