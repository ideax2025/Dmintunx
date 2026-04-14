/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ChevronRight, 
  Menu, 
  X,
  Send,
  ArrowUpRight,
  Calendar,
  Clock,
  Tag
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

// --- Types ---

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

// --- Hardcoded Data (To be moved to Supabase later) ---

const PROJECTS: Project[] = [];

const BLOG_POSTS: BlogPost[] = [];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-black/80 backdrop-blur-md py-3 border-b border-white/5" : "bg-transparent py-6"
    )}>
      <div className="container-custom flex justify-center items-center">
        {/* Navigation Links - Visible on both mobile and desktop */}
        <div className="flex items-center gap-6 md:gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className={cn(
                "nav-link",
                location.pathname === link.href && "text-gold"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

interface PortfolioSection {
  id: number;
  category: string;
  title: string;
  content: string;
  order_index: number;
}

// --- Supabase Hooks ---
import { supabase } from './lib/supabase';

const usePortfolioSections = () => {
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase
        .from('portfolio_sections')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) {
        console.error('Error fetching portfolio sections:', error);
      } else {
        setSections(data || []);
      }
      setLoading(false);
    };

    fetchSections();
  }, []);

  return { sections, loading };
};

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return { projects, loading };
};

const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { posts, loading };
};

// --- Pages ---

const HomePage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col gap-24 pb-24">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col justify-center pt-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col items-center gap-6 mb-12">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-gold/30 p-1">
                    <img 
                      src="https://picsum.photos/seed/professional/400/400" 
                      alt="D Min Tun" 
                      className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">D Min Tun</h2>
                  </div>
                </div>
                
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 leading-tight tracking-tight">
                  <span className="block">Building Tech-driven Solutions</span>
                  <span className="text-white/40 italic block mt-1">for a Better Community.</span>
                </h1>
                <p className="text-white/50 text-[10px] md:text-xs mb-10 leading-relaxed max-w-lg mx-auto">
                  I focus on creating meaningful digital experiences that empower communities and drive positive change through technology.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8">
                  <Link to="/portfolio" className="btn-primary">
                    Explore Work
                  </Link>
                  <div className="flex items-center gap-5">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors"><Github size={18} /></a>
                    <a href="https://www.linkedin.com/in/dmintunx/" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors"><Linkedin size={18} /></a>
                    <a href="https://t.me/Dmintun_X" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors"><Send size={18} /></a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Blog Preview Section - Simplified to just a CTA */}
        <section className="container-custom">
          <div className="flex justify-center">
            <Link 
              to="/blog" 
              className="px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-gold text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-black hover:border-gold transition-all duration-500 group flex items-center gap-3"
            >
              Explore the Journal
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

const PortfolioPage = () => {
  const { sections, loading } = usePortfolioSections();

  return (
    <PageTransition>
      <section className="pt-28 pb-16">
        <div className="container-custom">
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-white/20 text-xs uppercase tracking-widest animate-pulse">Loading Portfolio...</p>
            </div>
          ) : sections.length > 0 ? (
            <div className="space-y-24">
              {sections.map((section) => (
                <div key={section.id} className="max-w-3xl">
                  <div className="mb-8">
                    <span className="text-gold text-[10px] uppercase tracking-[0.4em] mb-2 block font-bold">
                      {section.category}
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        img: ({ node, ...props }) => (
                          <img 
                            {...props} 
                            className="rounded-xl border border-white/10 my-8 w-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        ),
                        h3: ({ node, ...props }) => <h3 {...props} className="text-white font-bold mt-8 mb-4" />,
                        p: ({ node, ...props }) => <p {...props} className="text-white/60 leading-relaxed mb-4" />,
                        ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside space-y-2 mb-4 text-white/60" />,
                        li: ({ node, ...props }) => <li {...props} className="text-white/60" />,
                      }}
                    >
                      {section.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-white/10">
              <p className="text-white/20 text-xs uppercase tracking-widest">No portfolio content found in database.</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

const BlogPage = () => {
  const { posts, loading } = useBlogPosts();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubmitting(true);
    setMessage(null);
    
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Thank you for subscribing!' });
      setEmail('');
    } catch (error: any) {
      console.error('Subscription error:', error);
      setMessage({ 
        type: 'error', 
        text: error.code === '23505' ? 'This email is already subscribed.' : 'Something went wrong. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="pt-28 pb-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <span className="text-gold text-[10px] uppercase tracking-[0.4em] mb-2 block font-bold">Journal</span>
              <h2 className="text-xl font-bold text-white tracking-tight">Thoughts & Insights</h2>
            </div>
            
            <div className="w-full md:w-auto">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">Subscribe to the newsletter</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-gold transition-colors w-full md:w-64"
                  required
                />
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-gold text-black px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {submitting ? '...' : 'Join'}
                </button>
              </form>
              {message && (
                <p className={cn(
                  "text-[9px] mt-2 uppercase tracking-widest",
                  message.type === 'success' ? "text-green-500" : "text-red-500"
                )}>
                  {message.text}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-white/20 text-xs uppercase tracking-widest animate-pulse">Loading Journal...</p>
              </div>
            ) : posts.length > 0 ? posts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`}
                className="group block border-b border-white/5 pb-8 last:border-0"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {post.image && (
                    <div className="w-full md:w-64 aspect-video overflow-hidden bg-white/5 border border-white/5">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[9px] font-bold text-gold uppercase tracking-widest">{post.category}</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-widest">{post.date}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-white/40 text-xs leading-relaxed max-w-2xl mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest">
                      Read Post <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="py-20 text-center border border-dashed border-white/10">
                <p className="text-white/20 text-xs uppercase tracking-widest">No posts found in database.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

import rehypeRaw from 'rehype-raw';
import { Check, Copy } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="absolute top-3 right-4 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors group/btn"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Copy size={14} className="text-white/40 group-hover/btn:text-gold" />
      )}
    </button>
  );
};

const BlogPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="pt-28 container-custom text-white/20 text-xs uppercase tracking-widest text-center animate-pulse">Loading Post...</div>;
  if (!post) return <div className="pt-28 container-custom text-center">Post not found.</div>;

  // Extract headings for ToC
  const headings = post.content.match(/^#{1,3} .+/gm)?.map(h => {
    const level = h.match(/^#+/)?.[0].length || 1;
    const text = h.replace(/^#+ /, '');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return { level, text, id };
  }) || [];

  return (
    <PageTransition>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-white/5">
        <motion.div 
          className="h-full bg-gold"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="pt-28 pb-16">
        <div className="container-custom max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1 max-w-3xl mx-auto lg:mx-0">
              <Link to="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-gold text-[10px] uppercase tracking-widest mb-8 transition-colors">
                <ChevronRight size={14} className="rotate-180" /> Back to Journal
              </Link>
              
              <header className="mb-10">
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2 text-[10px] text-gold font-bold uppercase tracking-widest">
                    <Tag size={12} /> {post.category}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                    <Calendar size={12} /> {post.date}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                    <Clock size={12} /> {post.readTime}
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
                  {post.title}
                </h1>
                {post.image && (
                  <div className="aspect-video overflow-hidden border border-white/5 mb-12">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                  </div>
                )}
              </header>

              <div className="prose prose-lg prose-invert max-w-none">
                <ReactMarkdown 
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h1 id={id} className="scroll-mt-24">{children}</h1>;
                    },
                    h2: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h2 id={id} className="scroll-mt-24">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h3 id={id} className="scroll-mt-24">{children}</h3>;
                    },
                img: ({ node, ...props }) => (
                  <img 
                    {...props} 
                    className="rounded-xl border border-white/10 my-8 w-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                ),
                pre: ({ node, children, ...props }) => {
                  // More robust way to get text for copy button
                  const getCodeText = (nodes: any): string => {
                    if (typeof nodes === 'string') return nodes;
                    if (Array.isArray(nodes)) return nodes.map(getCodeText).join('');
                    if (nodes?.props?.children) return getCodeText(nodes.props.children);
                    return '';
                  };
                  
                  const codeText = getCodeText(children);
                  
                  return (
                    <div className="relative my-8 group">
                      <CopyButton text={codeText} />
                      <pre 
                        {...props} 
                        className="bg-[#050505] border border-white/10 p-6 pt-12 rounded-xl overflow-x-auto font-mono text-[12px] leading-relaxed text-white shadow-2xl"
                      >
                        {children}
                      </pre>
                    </div>
                  );
                },
                code: ({ node, inline, className, children, ...props }: any) => {
                  if (inline) {
                    return (
                      <code className="bg-white/10 text-gold px-1.5 py-0.5 rounded text-[10px] font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return <code className={className} {...props}>{children}</code>;
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sidebar ToC */}
        {headings.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6 font-bold">Table of Contents</div>
              <nav className="space-y-4">
                {headings.map((h, i) => (
                  <a 
                    key={i}
                    href={`#${h.id}`}
                    className={cn(
                      "block text-[11px] leading-relaxed transition-all duration-300 hover:text-gold",
                      h.level === 1 ? "text-white/80 font-medium" : 
                      h.level === 2 ? "text-white/50 pl-4" : "text-white/30 pl-8"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  </article>
</PageTransition>
);
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <footer className="pt-16 pb-10 border-t border-white/5 bg-[#050505]">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="text-xl font-bold tracking-tighter text-gold mb-4 block">
                  D MIN TUN.
                </Link>
                <p className="text-white/40 text-xs leading-relaxed max-w-sm mb-6">
                  Building tech-driven solutions for a better community. Focused on creating meaningful digital experiences that empower and drive positive change.
                </p>
                <div className="flex gap-5">
                  <a href="https://github.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold transition-all"><Github size={14} /></a>
                  <a href="https://www.linkedin.com/in/dmintunx/" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold transition-all"><Linkedin size={14} /></a>
                  <a href="https://t.me/Dmintun_X" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold transition-all"><Send size={14} /></a>
                </div>
              </div>
              
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-6">Navigation</h4>
                <ul className="space-y-4">
                  <li><Link to="/" className="text-[10px] text-white/40 hover:text-gold uppercase tracking-widest transition-colors">Home</Link></li>
                  <li><Link to="/portfolio" className="text-[10px] text-white/40 hover:text-gold uppercase tracking-widest transition-colors">Portfolio</Link></li>
                  <li><Link to="/blog" className="text-[10px] text-white/40 hover:text-gold uppercase tracking-widest transition-colors">Blog</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-6">Get in Touch</h4>
                <ul className="space-y-4">
                  <li>
                    <a 
                      href="mailto:dmintun.x@gmail.com" 
                      className="text-[10px] text-white/40 hover:text-gold uppercase tracking-widest transition-colors"
                    >
                      dmintun.x@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
              <div className="text-[9px] text-white/20 uppercase tracking-[0.2em]">
                © 2024 D Min Tun. All Rights Reserved.
              </div>
              <div className="flex gap-8">
                <a href="#" className="text-[9px] text-white/20 hover:text-gold uppercase tracking-widest transition-colors">Privacy Policy</a>
                <a href="#" className="text-[9px] text-white/20 hover:text-gold uppercase tracking-widest transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
