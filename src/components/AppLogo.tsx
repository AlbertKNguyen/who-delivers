import { NextComponentType } from 'next';
import Image from 'next/image';

export const AppLogo: NextComponentType = () => {
  return (
    <div style={{ marginTop: '-80px', marginBottom: '-80px' }}>
      <Image src='/logo.png' width={150} height={150} />
    </div>
  );
};
