import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <Image src={'/logo.svg'} alt="logo" width={240} height={26} />
    </header>
  );
}
