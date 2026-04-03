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
    image: "https://memora-public.s3.us-east-1.amazonaws.com/user-1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5C5RIVYOD4XG44AU%2F20260403%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260403T173141Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCICBaHdDugcc4WxBU4ybyhmgU8G2eCitMOjLDMePWFrf9AiBVSpi7DKd0T%2FUpl3ZHVLAABUvJOx4jJgV%2FE8V9RNyM7SrkAgiL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDg5OTYzMDU0MjM2NCIM%2FhAsFFBn6Q5Wi59RKrgCrIUdq2Yr9L%2B9tMFTruo9RLoHgxGPGNjoeyrDCnzt7TssvQrawNvQkKCTGXPpSMsSfP8O%2BrLmtOSY1YjOiqt3ahFjCiiMhnyGRluXSBnJUTMZKZgMZCwSj0IGG6sqEnASxxl%2FLiHRqO7DAN1SxizyT4Ds45h4WJPpxsLm7%2BL6pKJ%2FzF0PNUcHMbqyo9yX0%2BFAGitg%2BYzb6trJFgYpjNdwjwPTSb%2Fp%2Fe9F3DWUfVHgMraxOEEMoDGgm6tSG%2BbJe%2B8%2B%2FJTWGcrL2WJbqKrrVTsmbUT%2Fl9FHmz4UMfvF61cMvBsySD9qQ%2F8E%2BzzmSZ7qk9MDNEb6SNFU3UG5irEfBMy9vE%2B%2FvCXk98dFT%2BJPEBa%2FT3bhyIXj3thDUrI7P%2BunprEuYwykm4J17s66j4F5aztQ7L1tU1EfiQAmMJrDvc4GOq4CR9yupzfnjfvfcSCupSHIgQ02zHskMU1lfWq7I3ehIWHb4gQ69XktEaAjZ2RB2nWiSX1YYiU0vQ1ox%2BSZiHRPAdjtBUzuBHoXGEnX5PbD9lVW3ujFLQxGgZ%2FcI%2BIWUylsiYrhsaUjxACqwzD%2BfKx4cTZuIXXj6ihSm%2B9ss09P1D%2BeRnHF7MPuWPjaWCYg%2BRTnzfOFHRPuKLgp%2BaGP5JAJpbm4IpeGGwOkcmpVjEvC4pwI6fclPDeXDIpZfnmWXhCAV2jcvlRhxLHb%2Fiqyx13VP5kgrG2nw%2FYM8Xzpuax9T0urdZY8G3cV0bDW7zjoClf4oID%2B0llvrdZ7CCU8IVLqk0L7K%2FY4Q1lYiIuf9Z6z7IUGZh00LdVyb4Srdf1yrJ4DLgSe5tLKSmdm8VxPaGE%3D&X-Amz-Signature=5905dc4745acbf9d3310121185df120dad3097e1103e03157efdf7ea6f549965&X-Amz-SignedHeaders=host&response-content-disposition=inline"   ,
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
      "https://memora-public.s3.us-east-1.amazonaws.com/user2.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5C5RIVYOF4P5U735%2F20260403%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260403T172940Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIHWJXESJScoHYdn3t%2F%2FmMhEMsHFHbCWF3T%2B1s9g8uguyAiEAhdDbbraim6OuFoVN1U%2FotfLSEZLMNFHaVI728O2jppcq5AIIi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw4OTk2MzA1NDIzNjQiDJ4%2BIDq8kH10kJy7Eiq4Aj10bNDwRdDZHhToOnQwqtCUUfzg29ioCirBx5JlHwb4%2FFCB7qubyuAXsEy%2FaxfQZD2Dcv43rrutvVe8QqCcQU%2BaJ9%2B7LpzZn2m7gOvw8VPd8%2F%2FzuXb8%2B73hzNB4OQ%2BX6yONJo5FVFC4ppNrSm6YOpZJcxUtaxdYd1aa%2BI6o%2Fk0pJQVugNiyWpLUbaj9lUT11eg%2B5pRXX7Cl4BBTTRT7EbhWj5TmWxtEFHANTg4T%2FtKefQ1oFhyWgH8D5cGk7NCJpnQj1T3Bnwa%2BxJMEG7CbsN7IiqAgHsG7ITIQ6O7%2F7Av%2BHliK3kSqn1vubslYxbWjs5g%2B%2BflIDIagJYLS%2BlAXnw%2FangbDsMBz6sgZx7aytFKiByahkJ%2FtebT2b4iH2hA%2BHNyq4h09YJRKK67sFg3Ti7YcYdv6UKYBpDCaw73OBjqtAkFE01XCHSD5AgVmyiJoAwaXWRaf5QJMLaN%2FGscHO44a6azNkcSKYVqZOC8arlwOKIU7gx%2BANq6zMROZfF7BAY0WmGiAPj95F3MfaEWCGHzW2brZ5vrXla2ZKVkvgwh0VbpMH6F1nn%2Bv6yljGHEYnwYFloeErYEVZef5eFYGopovprrg3unt9Fg2ATcAxg8M4kVmQaupvUWIsfChZhwKuxGNp7b9Xb1Q3Sa64m7rzu9zjSbLf9q2C9Bgdf6b5RW%2B36jSGu28qdT859SKSF3FfJztlrIo%2B14Goqh%2BqiJtOdtvP0BxiJQnLHlmlCIwW5kvqrfAs8PxSImyJVnjsQujaao7g%2B%2FBzIcaDyNeFvM%2FVwsvZwXbc1JJ4%2BKNg2u0vl7V0qDtbNUgu3iXbVQnIvo%3D&X-Amz-Signature=993c9d2b88f3944030bb1dc2f822b92ff9e4cb6832e8de32c0158fe6a95b2262&X-Amz-SignedHeaders=host&response-content-disposition=inline",
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
      "https://memora-public.s3.us-east-1.amazonaws.com/user3.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5C5RIVYOA7WQOI7B%2F20260403%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260403T173006Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIC8yi1T6mjOKqH%2F3PROxIGWj3xrKp79sEHxoaeCigx9tAiAE6hOkg4pUdiZg4KR1Eumvv6jrWDRNZG5Qtf4Ds6GOjCrkAgiL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDg5OTYzMDU0MjM2NCIMM4JWpkRuoftf%2By%2B7KrgCuQuDZ5wudFwn3QyeN8PrbmqgCePWNBkbY89J1WjXXjvXqm2JFLrGsY07w7M98npdEk9jNopzaAk7hcyB8andREil8avkiJgKEicdbXQA3iC%2BpdhjxRX0m9wqHOXbMFwW4ggvNZTQNFoDj8rVzGaaOHW6wAbiIIlgUaI3h6g2WrOr2uikGCILdYTB9mAoaAWreb2UNqxYPYMkpBW2HDrcCREZxkHMSdJmfTlHrHBRe2JkOZXcUN%2FiBK7Rf6%2Fth0BS0KkTzeD2cIfMnCrBagQiSyBFrYX2pCTFyrUUI9qbKPhZX2HB%2FFZCgqQM8lctY1bMot5FbfzGW5djM4xkHjKO8ThdXYDh%2FAoAGWFaVvms7E6vNmoCI%2FVR7qlbsnuS4xM2T5fBgOhk%2FA9%2Bo1Pdw3fzVzaV6R5IZlKLMJrDvc4GOq4C6Qd6RbzLV%2BTZhUVXuRy%2BM8AwwRyYaObXGwmYbtkYnTJwU1TTPe7Q2Wut60s5PUyjmAwNyXbdLRd2zpNGgYgx%2FjJT2ZlMusgdcxjX5WywMQUjKcK2nd%2BYBQnLufSHpYlP8n7h%2Ffr8ESmR89HWZ5i1qDNRPTota1mgHAySPssLoSfwnzFLdlIlrZV3C9zoxBUcbVR2gdLRGPmXXSdpXtAxweyu7bIy68vFy7xp79Jtl822bAqWQ6Hc7l3F732pT6lmMmmE0OrLiumn8zSNpZ4BHHZNDwjOvFZxxdHj6%2B%2BQbOObQ15QtpxRQJa5pMI4hP6I5Bt%2F1A%2ByFFMIFKGLVdoIj5iOYQ2p6mxNVYIumkRG0z07nUmYGMJbmJiqA2hMHwm%2FCIH9FcgWKybaQymXA0E%3D&X-Amz-Signature=137163059faf256cd50046d7ae18d2c9ae4fb25f43136004a2914314a9ce0d93&X-Amz-SignedHeaders=host&response-content-disposition=inline",
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