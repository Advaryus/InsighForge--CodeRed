export function CompanyLogos() {
  const logos = [
    { src: "/placeholder.svg?height=40&width=120", alt: "OpenAI" },
    { src: "/placeholder.svg?height=40&width=120", alt: "Toyota" },
    { src: "/placeholder.svg?height=40&width=120", alt: "Airbnb" },
    { src: "/placeholder.svg?height=40&width=120", alt: "SAP" },
    { src: "/placeholder.svg?height=40&width=120", alt: "Square" },
    { src: "/placeholder.svg?height=40&width=120", alt: "Nuro" },
    { src: "/placeholder.svg?height=40&width=120", alt: "GM" },
    { src: "/placeholder.svg?height=40&width=120", alt: "Lyft" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {logos.map((logo, index) => (
        <div key={index} className="flex items-center justify-center">
          <img
            src={logo.src}
            alt={logo.alt}
            className="h-8 object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200"
          />
        </div>
      ))}
    </div>
  );
}
