import Image from 'next/image';

export const AppLogo = () => {
  return (
    <div style={{ marginTop: '-80px', marginBottom: '-63px' }}>
      <Image src='/logo.png' width={150} height={56.25} />
    </div>
  );
};
