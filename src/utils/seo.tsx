import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  author?: string;
  type?: string;
}

export function SEO({
  title = "Mēl Milaap – Australia & New Zealand's Premier South Asian Matrimony & Wedding Platform",
  description = "Find your perfect match and plan your wedding with Mēl Milaap. A trusted South Asian matrimony and wedding platform connecting hearts, families, and traditions.",
  canonical,
  ogImage = "/api/placeholder/1200/630",
  keywords = "south asian matrimony, indian wedding, pakistani wedding, sri lankan wedding, australian indian wedding, new zealand indian wedding, wedding suppliers, matrimony australia, wedding planning",
  author = "Mēl Milaap",
  type = "website"
}: SEOProps) {
  const currentUrl = canonical || window.location.href;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Mēl Milaap" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Mēl Milaap",
          "description": description,
          "url": "https://melmilaap.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://melmilaap.com/logo.png"
          },
          "sameAs": [
            "https://facebook.com/melmilaap",
            "https://instagram.com/melmilaap",
            "https://twitter.com/melmilaap"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": ["AU", "NZ"]
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+61-xxx-xxx-xxx",
            "contactType": "Customer Service",
            "email": "hello@melmilaap.com"
          }
        })}
      </script>
    </Helmet>
  );
}