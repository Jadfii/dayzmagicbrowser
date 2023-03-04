/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getIslandImageURL, IMAGE_CDN_URL } from '../../constants/links.constant';
import { Server } from '../../types/Types';

export const config = {
  runtime: 'edge',
};

const fontRegular = fetch(new URL('../../assets/Inter-Regular.ttf', import.meta.url).toString()).then((res) => res.arrayBuffer());
const fontBold = fetch(new URL('../../assets/Inter-Bold.ttf', import.meta.url).toString()).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  try {
    const regularFontData = await fontRegular;
    const boldFontData = await fontBold;

    const { searchParams } = new URL(req.url);

    const serverIp = searchParams.get('serverIp');
    const serverPort = searchParams.get('serverPort');

    if (!serverIp || !serverPort) {
      return new ImageResponse(<>Visit with &quot;?serverIp=0.0.0.0&serverPort=2302&quot;</>, {
        width: 1200,
        height: 600,
      });
    }

    const server = (await fetch(`https://browser.dayzmagiclauncher.com/api/servers/${serverIp}/${serverPort}`).then((res) => res.json())) as Server;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'black',
            fontFamily: '"Inter Regular"',
          }}
        >
          <img
            src={`${IMAGE_CDN_URL}${getIslandImageURL(server?.relatedIsland?.terrainId)}?tr=h-600,w-1200,c-at_least`}
            alt="background"
            style={{ position: 'absolute', objectFit: 'contain', opacity: 0.5 }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', bottom: '5%', left: '5%', color: 'white' }}>
            <h1 style={{ fontSize: 64, fontFamily: '"Inter Bold"', marginBottom: 0 }}>{server?.name}</h1>
            <h4 style={{ fontSize: 32, marginTop: 0 }}>
              {server.relatedIsland?.name} - {server.version}
            </h4>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'Inter Regular',
            data: regularFontData,
            style: 'normal',
          },
          {
            name: 'Inter Bold',
            data: boldFontData,
            style: 'normal',
          },
        ],
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
