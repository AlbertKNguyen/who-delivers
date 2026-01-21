import Image from 'next/image';

export const AppLogo = () => {
  return (
    <div style={{ marginBottom: '-20px' }}>
      <Image src='/logo.png' width={150} height={56.25} alt='WhoDelivers Logo' />
    </div>
  );
};
