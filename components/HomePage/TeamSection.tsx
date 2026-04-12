import Link from "next/link";

const TeamSection = () => {
  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">

        <div className="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
          <div className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
              <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                Building Meaningful Solutions Through Collaboration
              </h2>

              <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                We are a team of developers passionate about creating technology that solves real-world problems. This
                project reflects our combined efforts in designing a secure and user-focused platform that helps
                individuals manage and protect their digital legacy.
              </p>

              <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                Through collaboration, continuous learning, and problem-solving, we transformed complex ideas into a
                functional full-stack application. Our goal was not only to build a product but also to deepen our
                understanding of modern technologies and real-world system design.
              </p>

            </div>
            <Link
              href="/sign-up"
              className="sm:w-fit w-full px-3.5 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all 
              duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex"
            >
              <span className="px-1.5 text-white text-sm font-medium leading-6">Get Started</span>
            </Link>
          </div>
          <img
            className="w-full lg:h-[500px] h-[320px] lg:mx-0 mx-auto rounded-3xl object-cover object-center"
            src="https://memora-public.s3.us-east-1.amazonaws.com/team.jpeg"
            alt="Memora team members collaborating"
          />
        </div>

        
      </div>
    </section>
  );
};

export default TeamSection;
