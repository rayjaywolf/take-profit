import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');

    if (!assetId) {
      return NextResponse.json(
        { error: "Asset ID is required" },
        { status: 400 }
      );
    }

    const muxTokenId = process.env.MUX_TOKEN_ID;
    const muxTokenSecret = process.env.MUX_TOKEN_SECRET;

    if (!muxTokenId || !muxTokenSecret) {
      return NextResponse.json(
        { error: "Mux credentials not configured" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${muxTokenId}:${muxTokenSecret}`).toString('base64');

    // First, try to get the asset via playback ID (since most URLs contain playback IDs)
    let response = await fetch(`https://api.mux.com/video/v1/playback-ids/${assetId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const playbackData = await response.json();
      console.log('Playback ID Response:', JSON.stringify(playbackData, null, 2));
      const actualAssetId = playbackData.data.object.id;
      console.log('Extracted Asset ID:', actualAssetId);
      
      // Now fetch the asset data
      response = await fetch(`https://api.mux.com/video/v1/assets/${actualAssetId}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      // If playback ID fails, try as asset ID directly
      response = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) {
      console.error('Mux API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch video data from Mux: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Mux API Response:', JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      asset: {
        id: data.data.id,
        status: data.data.status,
        duration: data.data.duration,
        aspect_ratio: data.data.aspect_ratio,
        created_at: data.data.created_at,
        playback_ids: data.data.playback_ids,
        tracks: data.data.tracks,
      },
    });
  } catch (error) {
    console.error("Error fetching Mux video data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
