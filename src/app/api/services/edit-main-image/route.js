import { NextResponse } from "next/server";

export async function POST(req){
  try{
    const res = await fetch(" http://tm-web.effisoftsolutions.com/services/edit-main-image-web", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: req
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