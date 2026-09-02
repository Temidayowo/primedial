import Image from "next/image";

const Story = () => {
  return (
    <section className="page-hero py-20 px-8 md:px-32 text-left md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className="flex flex-col gap-4 order-2 md:order-1">
        <h3 className="font-poppins text-base font-bold text-green uppercase">
          Our Story
        </h3>
        <h2 className="font-clash-display text-2xl md:text-3xl lg:text-4xl font-bold text-blue">
          Founded on the field, not in a boardroom
        </h2>
        <p className="font-poppins text-gray-700 text-sm">
          Prime Dial Solutions was founded in 2020 by a team of licensed
          surveyors frustrated with equipment that couldn't keep up with the
          demands of modern job sites. What started as a small calibration
          workshop has grown into a trusted supplier of GNSS, robotic, and
          imaging systems for surveying professionals across the globe. <br />
          <br /> Today, our mission remains unchanged: equip every crew with
          instruments precise enough to stake a legal boundary, rugged enough to
          survive the field, and simple enough to trust on day one. Every
          product we sell is tested by working surveyors before it reaches
          yours.
        </p>
        <div className="flex gap-4 mt-4">
          <Image
            src="/images/about-hero.jpg"
            alt="Our Story"
            height={50}
            width={50}
            className="h-12 w-12 rounded-full"
          />
          <div className="flex flex-col font-poppins">
            <h4 className="font-semibold text-blue">Surv. Olawuni Oladayo</h4>
            <p className="text-sm text-gray-700">
              Founder & CEO, Primedial Solutions
            </p>
          </div>
        </div>
      </div>
      <div className="order-1 md:order-2 md:p-6">
        <Image
          src="/images/grp-of-survs.png"
          alt="Our Story"
          height={1024}
          width={1024}
          priority
          className="h-full w-full object-cover rounded-2xl"
        />
      </div>
    </section>
  );
};

export default Story;
