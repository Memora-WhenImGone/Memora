type Testimonial = {
  id: number;
  name: string;
  address: string;
  profession: string;
  image: string;
  rating: number;
  review: string;
};

const testimonials: Testimonial[] = [
   {
    id: 1,
    name: "Hilal",
    address: "Vancouver, BC",
    profession: "Senior UI & Web Designer ",
    image:
      "/user1.jpg",
    rating: 5,
    review:
      "This platform is simple and reliable. I like how my data stays protected and shared only with trusted contacts at right time.",
  },
  {
    id: 2,
    name: "Umer",
    address: "Toronto, Canada",
    profession: "Software Engineer",
    image:
      "https://media.licdn.com/dms/image/v2/D4E22AQFrv1DoryJw6A/feedshare-shrink_1280/B4EZ02ETcDG4AM-/0/1774728591808?e=1776902400&v=beta&t=K07381sg-Kf1PCZZ8e8GDQf5-0cHRe_ehpJ81133P5Y",
    rating: 4,
    review:
      "Memora is a very smart idea. I feel safe knowing my important documents are secure and will reach the right people when needed.",
  },
  {
    id: 3,
    name: "Jasica",
    address: "Abbotsford, BC",
    profession: "Operations Lead",
    image:
      "/user2.jpeg",
    rating: 4,
    review: `I recently used mymemora.online, and it works really well. I love the concept of preserving memories. 
    The thing that I liked the most is being able to save your will digitally. As someone who has always wanted to create memories and keepsakes for the future, this is very special.`,
  },

    {
    id: 4,
    name: "Farmaan",
    address: "Toronto, ON",
    profession: "Business Operations",
    image:
      "/user3.jpg",
    rating: 4,
    review:
      "I didn't like email verification and OTP as it's a long process. I enjoyed the onboarding, and the idea of the app is awesome. I really liked the end-to-end encryption and would love to have a dark mode in the app."
      + " I also enjoyed the flow in which the vault progresses, although I got an error during a long video upload.",
  }
 
];

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    className="w-4 h-4 text-yellow-400"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 17.25l-6.16 3.73 1.64-7.03L2.5 9.77l7.19-.61L12 2.5l2.31 6.66 7.19.61-5 4.18 1.64 7.03z"
    />
  </svg>
);

export default function Testimonials() {
  return (
    <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 pt-20 pb-30">
      <div className="flex flex-col justify-center items-center text-center">
        <h2 className="text-4xl md:text-[40px] font-bold">
          Real Stories from Our Users
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20 mb-10">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="bg-white p-6 rounded-xl shadow max-w-xs"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-20 h-20 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="font-playfair text-xl">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.address}</p>
                <p className="text-gray-400 text-xs">
                  {testimonial.profession}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Star key={index} filled={testimonial.rating > index} />
                ))}
            </div>

            <p className="text-gray-500 max-w-90 mt-4 whitespace-pre-line">
              "{testimonial.review}"
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}