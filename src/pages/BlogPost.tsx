"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  User,
  Clock,
  Share,
  Heart,
  MessageCircle,
  ArrowLeft,
  BookOpen,
  Twitter,
  Facebook,
  Linkedin,
  Copy
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/utils/seo";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  category: string;
  tags: string[];
  cover_image?: string;
  published_at: string;
  read_time_minutes: number;
  slug: string;
  seo_title?: string;
  seo_description?: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = React.useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (articleSlug: string) => {
    setIsLoading(true);
    try {
      // Load main article
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', articleSlug)
        .eq('status', 'published')
        .single();

      if (articleError) {
        if (articleError.code === 'PGRST116') {
          navigate('/blog', { replace: true });
          return;
        }
        throw articleError;
      }

      setArticle(articleData);

      // Load related articles
      const { data: relatedData, error: relatedError } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .eq('category', articleData.category)
        .neq('id', articleData.id)
        .limit(3)
        .order('published_at', { ascending: false });

      if (relatedError) throw relatedError;
      setRelatedArticles(relatedData || []);

    } catch (error) {
      console.error('Error loading article:', error);
      toast({
        title: "Error",
        description: "Could not load the article. Please try again.",
        variant: "destructive"
      });
      navigate('/blog', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const shareArticle = async (platform: string) => {
    if (!article) return;
    
    const url = window.location.href;
    const text = `${article.title} - ${article.excerpt}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied",
            description: "Article link copied to clipboard.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Could not copy link to clipboard.",
            variant: "destructive"
          });
        }
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-64 bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-foreground mb-2">Article not found</h1>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/blog">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={article.seo_title || `${article.title} – Mēl Milaap Blog`}
        description={article.seo_description || article.excerpt}
        keywords={`${article.tags.join(', ')}, wedding blog, south asian wedding`}
        ogImage={article.cover_image}
        type="article"
      />
      <Navigation />
      
      {/* Article Header */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <Link to="/blog">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="mb-6">
                <Badge variant="secondary" className="mb-4">
                  {article.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {article.author_name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(article.published_at).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {article.read_time_minutes} min read
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center space-x-2 mb-8">
                  <span className="text-sm text-muted-foreground mr-2">Share:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareArticle('twitter')}
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareArticle('facebook')}
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareArticle('linkedin')}
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareArticle('copy')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Cover Image */}
              {article.cover_image && (
                <motion.div variants={fadeInUp} className="mb-8">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="prose prose-lg dark:prose-invert max-w-none"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="text-foreground leading-relaxed"
              />
            </motion.div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <motion.div 
                className="mt-8 pt-8 border-t"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="text-center mb-12"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  Related Articles
                </h2>
                <p className="text-muted-foreground">
                  More stories and tips from the same category
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {relatedArticles.map((relatedArticle) => (
                  <motion.div key={relatedArticle.id} variants={fadeInUp}>
                    <Link to={`/blog/${relatedArticle.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow group">
                        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                          {relatedArticle.cover_image ? (
                            <img 
                              src={relatedArticle.cover_image} 
                              alt={relatedArticle.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <Badge variant="secondary" className="text-xs mb-3">
                            {relatedArticle.category}
                          </Badge>
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {relatedArticle.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{relatedArticle.author_name}</span>
                            <span>{relatedArticle.read_time_minutes} min read</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center bg-card rounded-xl p-12"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                Enjoyed this article?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for more wedding inspiration, planning tips, 
                and love stories delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                />
                <Button>Subscribe</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;