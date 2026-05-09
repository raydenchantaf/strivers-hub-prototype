import Image from "next/image";

export default function Hero2() {
  return (
    <section className="relative section-padding overflow-hidden">
      <div className="container-max section-padding py-2 px-4 md:px-8 mx-auto flex flex-col items-start text-left gap-4">

        {/* Headline — Inter ExtraBold 64px #B12069 */}
        <h1 className="font-extrabold text-[clamp(40px,6vw,64px)] text-[#B12069] leading-[1.05em] whitespace-pre-line">
          {"Elevating Malaysian\nWomen Entrepreneurs"}
        </h1>

        {/* Paragraph — Inter Light 20px black */}
        <p className="max-w-2xl font-light text-[clamp(16px,2vw,20px)] text-black leading-[1.25em]">
          We are dedicated to bridging the digitalization gap for Malaysian women
          entrepreneurs by providing tailored solutions that meet their unique needs.
        </p>

        {/* Logo row */}
        <div className="flex items-center gap-6 mt-2">
          <Image
            src="/logo.svg"
            alt="Strivers' Hub"
            width={186}
            height={55}
            className="object-contain"
          />
          <div className="h-10 w-px bg-gray-300" />
          <Image
            src="/MyDigital.png"
            alt="MyDigital"
            width={180}
            height={56}
            className="object-contain"
          />
        </div>

      </div>
    </section>
  );
}
