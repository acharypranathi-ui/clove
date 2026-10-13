// Clove Dental Pure React 18 Application (Native JS without Babel CORS requirement)

const { useState, useEffect, createElement: e } = React;

function App() {
  const getInitialRoute = () => {
    try {
      const raw = (window.location.hash || '').replace(/^#\/?/, '').trim();
      if (raw.startsWith('blog/')) {
        const slug = raw.replace('blog/', '').trim();
        return { page: 'blog-article', slug: slug || 'complete-dental-care-guide' };
      }
      if (raw === 'blog') return { page: 'blog', slug: 'complete-dental-care-guide' };
      if (['home', 'about', 'doctors', 'services', 'treatments', 'gallery', 'testimonials', 'contact'].includes(raw)) {
        return { page: raw, slug: 'complete-dental-care-guide' };
      }
    } catch (err) {}
    return { page: 'home', slug: 'complete-dental-care-guide' };
  };

  const initialRoute = getInitialRoute();
  const [activePage, setActivePage] = useState(initialRoute.page);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState(initialRoute.slug);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modals & Active Selections
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPreselect, setBookingPreselect] = useState({});

  // Navigation and Article View Handlers
  const viewArticle = (slug) => {
    const targetSlug = slug || 'complete-dental-care-guide';
    setSelectedBlogSlug(targetSlug);
    setActivePage('blog-article');
    window.location.hash = `#blog/${targetSlug}`;
  };

  const navigateToPage = (pageId) => {
    setActivePage(pageId);
    window.location.hash = `#${pageId}`;
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [activePage, selectedBlogSlug]);

  // URL Hash Routing Synchronization
  useEffect(() => {
    const handleHashSync = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!rawHash) return;

      if (rawHash.startsWith('blog/')) {
        const slug = rawHash.replace('blog/', '').trim();
        if (slug) {
          setSelectedBlogSlug(slug);
          setActivePage('blog-article');
        }
      } else if (rawHash === 'blog') {
        setActivePage('blog');
      } else if (['home', 'about', 'doctors', 'services', 'treatments', 'gallery', 'testimonials', 'contact'].includes(rawHash)) {
        setActivePage(rawHash);
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Dynamic SEO Titles, Descriptions & Structured Data Schema
  useEffect(() => {
    const descMeta = document.querySelector('meta[name="description"]');
    let schemaElem = document.getElementById('dental-blog-schema');

    if (activePage === 'blog-article') {
      const blogList = (window.CLOVE_DATA && window.CLOVE_DATA.blogs) || [];
      const blog = blogList.find(b => b.slug === selectedBlogSlug) || blogList[0];
      
      if (blog) {
        document.title = `${blog.title} | Clove Dental Clinic`;
        if (descMeta) {
          descMeta.setAttribute('content', blog.shortDesc || "Complete dental care guide by Clove Dental covering preventive dental care, dental clinic treatments like root canal, dental implants, teeth cleaning, braces & oral health tips.");
        }

        if (!schemaElem) {
          schemaElem = document.createElement('script');
          schemaElem.id = 'dental-blog-schema';
          schemaElem.type = 'application/ld+json';
          document.head.appendChild(schemaElem);
        }

        const schemaData = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `https://clovedental.in/blog/${blog.slug}`,
              "headline": blog.title,
              "description": blog.shortDesc,
              "image": blog.image,
              "author": {
                "@type": "Person",
                "name": blog.submittedBy,
                "jobTitle": "Dental Healthcare & SEO Specialist"
              },
              "publisher": {
                "@type": "MedicalOrganization",
                "name": "Clove Dental",
                "url": "https://clovedental.in"
              },
              "datePublished": "2026-10-01",
              "dateModified": "2026-10-13",
              "mainEntityOfPage": `https://clovedental.in/blog/${blog.slug}`,
              "keywords": (blog.tags || []).join(", ")
            },
            {
              "@type": "FAQPage",
              "@id": `https://clovedental.in/blog/${blog.slug}#faq`,
              "mainEntity": (blog.faqs || []).map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.answer
                }
              }))
            }
          ]
        };
        schemaElem.textContent = JSON.stringify(schemaData);
      }
    } else if (activePage === 'blog') {
      document.title = "Dental Health & Wellness Blog — Treatments, Prevention & Smile Tips | Clove Dental";
      if (descMeta) {
        descMeta.setAttribute('content', "Read the latest dental care blogs, expert treatment guides, and oral health wellness tips from Clove Dental's network of 1,700+ specialist dentists.");
      }
      if (schemaElem) schemaElem.remove();
    } else {
      document.title = "Clove Dental — India's Most Trusted Dental Clinic Network";
      if (descMeta) {
        descMeta.setAttribute('content', "Book an appointment at Clove Dental. Over 730+ clinics, 1700+ expert dentists, 30L+ happy patients across India offering painless Root Canal, Dental Implants, Braces & Aligners.");
      }
      if (schemaElem) schemaElem.remove();
    }
  }, [activePage, selectedBlogSlug]);

  const openBooking = (preselect = {}) => {
    setBookingPreselect(preselect);
    setBookingModalOpen(true);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'services', label: 'Services' },
    { id: 'treatments', label: 'Treatments' },
    { id: 'blog', label: 'Blog' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' }
  ];

  return e('div', { className: 'app-wrapper' },
    // Top Bar
    e('div', { className: 'top-bar' },
      e('div', { className: 'container top-bar-content' },
        e('div', { className: 'top-bar-info' },
          e('div', { className: 'top-bar-item' },
            e('i', { className: 'fas fa-phone-alt' }),
            e('span', null, 'North India: ', e('strong', null, '+91 9667352322'), ' | South India: ', e('strong', null, '+91 9393552322'))
          ),
          e('div', { className: 'top-bar-item' },
            e('i', { className: 'fas fa-clock' }),
            e('span', null, 'Clinic Timings: Mon-Sun: 10:00 AM – 8:00 PM')
          )
        ),
        e('div', { className: 'top-bar-info' },
          e('div', { className: 'top-bar-item' },
            e('i', { className: 'fas fa-hospital' }),
            e('span', null, '730+ Clinics across 12+ Cities')
          )
        )
      )
    ),

    // Header
    e('header', { className: 'sticky-header' },
      e('div', { className: 'container' },
        e('nav', { className: 'navbar' },
          e('div', { className: 'logo-brand', onClick: () => navigateToPage('home'), style: { cursor: 'pointer' } },
            e('div', { className: 'logo-icon' }, e('i', { className: 'fas fa-tooth' })),
            e('div', { className: 'brand-text' }, 'clove', e('span', null, 'dental'))
          ),

          e('ul', { className: `nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}` },
            navItems.map(item => 
              e('li', { key: item.id },
                e('button', {
                  className: `nav-link ${activePage === item.id || (item.id === 'blog' && activePage === 'blog-article') ? 'active' : ''}`,
                  onClick: () => navigateToPage(item.id)
                }, item.label)
              )
            )
          ),

          e('div', { className: 'nav-cta' },
            e('button', { className: 'btn btn-primary', onClick: () => openBooking() },
              e('i', { className: 'fas fa-calendar-check' }), ' Book Appointment'
            ),
            e('button', {
              className: 'mobile-menu-toggle',
              onClick: () => setMobileMenuOpen(!mobileMenuOpen),
              'aria-label': 'Toggle menu'
            }, e('i', { className: `fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}` }))
          )
        )
      )
    ),

    // Main Router Content
    e('main', { className: 'page-container' },
      activePage === 'home' && e(HomePage, { setActivePage, openBooking, setSelectedTreatment, viewArticle, navigateToPage }),
      activePage === 'about' && e(AboutPage, { openBooking }),
      activePage === 'doctors' && e(DoctorsPage, { setSelectedDoctor, openBooking }),
      activePage === 'services' && e(ServicesPage, { openBooking }),
      activePage === 'treatments' && e(TreatmentsPage, { setSelectedTreatment, openBooking }),
      activePage === 'blog' && e(BlogPage, { setActivePage, viewArticle, openBooking, navigateToPage }),
      activePage === 'blog-article' && e(BlogArticlePage, { slug: selectedBlogSlug, setActivePage, openBooking, setSelectedTreatment, viewArticle, navigateToPage }),
      activePage === 'gallery' && e(GalleryPage, { setSelectedGalleryItem }),
      activePage === 'testimonials' && e(TestimonialsPage, { openBooking }),
      activePage === 'contact' && e(ContactPage, { openBooking })
    ),

    // Floating Chatbot Widget
    e(AIChatbot, { openBooking, setActivePage, viewArticle }),

    // Footer
    e(Footer, { setActivePage, openBooking, viewArticle, navigateToPage }),

    // Modals
    selectedDoctor && e(DoctorModal, { doctor: selectedDoctor, onClose: () => setSelectedDoctor(null), openBooking }),
    selectedTreatment && e(TreatmentModal, { treatment: selectedTreatment, onClose: () => setSelectedTreatment(null), openBooking }),
    selectedGalleryItem && e(GalleryLightbox, { item: selectedGalleryItem, onClose: () => setSelectedGalleryItem(null) }),
    bookingModalOpen && e(AppointmentModal, { preselect: bookingPreselect, onClose: () => setBookingModalOpen(false) })
  );
}

/* 1. HOME PAGE */
function HomePage({ setActivePage, openBooking, setSelectedTreatment, viewArticle, navigateToPage }) {
  const data = window.CLOVE_DATA;

  return e('div', { className: 'home-page' },
    // Hero
    e('section', { className: 'hero-section' },
      e('div', { className: 'container' },
        e('div', { className: 'hero-grid' },
          e('div', { className: 'hero-content' },
            e('div', { className: 'hero-badge' },
              e('i', { className: 'fas fa-certificate' }), ' India\'s Most Trusted Dental Clinic Network'
            ),
            e('h1', { className: 'hero-title' },
              'World-Class Dental Care ', e('span', null, 'Right Near You')
            ),
            e('p', { className: 'hero-description' },
              'Experience painless, ethical, and high-precision dental treatments across 730+ Clove Dental clinics. Powered by 1700+ specialist doctors and 10x safety protocols.'
            ),
            e('div', { className: 'hero-actions' },
              e('button', { className: 'btn btn-primary', onClick: () => openBooking() },
                e('i', { className: 'fas fa-calendar-alt' }), ' Book an Appointment'
              ),
              e('button', { className: 'btn btn-outline', onClick: () => setActivePage('contact') },
                e('i', { className: 'fas fa-map-marker-alt' }), ' Find a Clinic'
              )
            ),
            e('div', { className: 'hero-trust-pills' },
              e('div', { className: 'trust-pill-item' }, e('i', { className: 'fas fa-check-circle' }), ' 10x Sterilization Safety'),
              e('div', { className: 'trust-pill-item' }, e('i', { className: 'fas fa-check-circle' }), ' 7 Days Open'),
              e('div', { className: 'trust-pill-item' }, e('i', { className: 'fas fa-check-circle' }), ' Transparent Pricing')
            )
          ),
          e('div', { className: 'hero-image-wrapper' },
            e('div', { className: 'hero-img-card' },
              e('img', { src: 'assets/hero_dentist.jpg', alt: 'Clove Dental Specialist Caring for Patient' })
            ),
            e('div', { className: 'floating-trust-badge' },
              e('div', { className: 'trust-badge-icon' }, e('i', { className: 'fas fa-heart-pulse' })),
              e('div', { className: 'trust-badge-text' },
                e('h4', null, '30 Lakh+'),
                e('p', null, 'Happy Smiles Treated')
              )
            )
          )
        )
      )
    ),

    // Stats Bar
    e('section', { className: 'stats-section' },
      e('div', { className: 'container' },
        e('div', { className: 'stats-grid' },
          data.stats.map((stat, idx) =>
            e('div', { key: idx, className: 'stat-card' },
              e('div', { className: 'stat-icon' }, e('i', { className: `fas ${stat.icon}` })),
              e('div', { className: 'stat-value' }, stat.value),
              e('div', { className: 'stat-label' }, stat.label)
            )
          )
        )
      )
    ),

    // Why Choose Clove Dental
    e('section', { className: 'section-padding' },
      e('div', { className: 'container' },
        e('div', { className: 'section-title-wrapper' },
          e('span', { className: 'section-subtitle' }, 'Why Choose Clove Dental'),
          e('h2', { className: 'section-heading' }, 'Excellence in Modern Dentistry'),
          e('p', { className: 'section-description' }, 'We combine advanced clinical protocols with compassionate patient care to give you and your family the healthiest smiles.')
        ),
        e('div', { className: 'why-grid' },
          data.whyChooseUs.map((item, idx) =>
            e('div', { key: idx, className: 'why-card' },
              e('div', { className: 'why-icon-box' }, e('i', { className: `fas ${item.icon}` })),
              e('h3', null, item.title),
              e('p', null, item.description)
            )
          )
        )
      )
    ),

    // Popular Treatments Section
    e('section', { className: 'section-padding', style: { background: '#FFFFFF' } },
      e('div', { className: 'container' },
        e('div', { className: 'section-title-wrapper' },
          e('span', { className: 'section-subtitle' }, 'Popular Treatments'),
          e('h2', { className: 'section-heading' }, 'Comprehensive Dental Solutions'),
          e('p', { className: 'section-description' }, 'From routine check-ups to complex full-mouth implant restorations, our expert dentists deliver lasting results.')
        ),
        e('div', { className: 'treatments-grid' },
          data.treatments.slice(0, 12).map((trt) =>
            e('div', { key: trt.id, className: 'treatment-card' },
              e('img', { src: trt.image, alt: trt.title, className: 'treatment-img' }),
              e('div', { className: 'treatment-body' },
                e('span', { className: 'treatment-tag' }, trt.category),
                e('h3', null, trt.title),
                e('p', null, trt.shortDesc),
                e('div', { className: 'treatment-footer' },
                  e('button', { className: 'btn btn-outline btn-sm', onClick: () => setSelectedTreatment(trt) },
                    'Learn More ', e('i', { className: 'fas fa-arrow-right' })
                  ),
                  e('button', { className: 'btn btn-primary btn-sm', onClick: () => openBooking({ treatment: trt.title }) },
                    'Book'
                  )
                )
              )
            )
          )
        ),
        e('div', { style: { textAlign: 'center', marginTop: '3rem' } },
          e('button', { className: 'btn btn-secondary', onClick: () => setActivePage('treatments') },
            'View All Dental Treatments ', e('i', { className: 'fas fa-chevron-right' })
          )
        )
      )
    ),

    // Dental Health & Wellness Blog Section
    e('section', { className: 'section-padding homepage-blog-section' },
      e('div', { className: 'container' },
        e('div', { className: 'section-title-wrapper' },
          e('span', { className: 'section-subtitle' }, 'Dental Health & Wellness Blog'),
          e('h2', { className: 'section-heading' }, 'Expert Guides & Healthy Smile Tips'),
          e('p', { className: 'section-description' }, 'Evidence-based oral healthcare insights, prevention advice, and treatment guides from Clove Dental experts to keep your family smiling bright.')
        ),

        (() => {
          const blogList = data.blogs || [];
          const featured = blogList.find(b => b.featured) || blogList[0];
          if (!featured) return null;

          return e('div', { className: 'home-blog-container' },
            // Featured Article Hero Banner
            e('div', { className: 'featured-blog-banner' },
              e('div', { className: 'featured-blog-media' },
                e('img', { src: featured.image, alt: featured.imageAlt || featured.title }),
                e('div', { className: 'featured-blog-badge-overlay' },
                  e('i', { className: 'fas fa-award' }), ' Featured Clinical Guide'
                )
              ),
              e('div', { className: 'featured-blog-content' },
                e('div', { className: 'blog-meta-row' },
                  e('div', { className: 'blog-meta-item' },
                    e('i', { className: 'fas fa-user-edit' }), ' By ', e('strong', null, featured.submittedBy)
                  ),
                  e('div', { className: 'blog-meta-item' },
                    e('i', { className: 'far fa-clock' }), ' ', featured.readTime
                  ),
                  e('div', { className: 'blog-meta-item' },
                    e('i', { className: 'fas fa-calendar-alt' }), ' ', featured.publishedDate
                  )
                ),
                e('h3', {
                  className: 'featured-blog-title',
                  style: { cursor: 'pointer' },
                  onClick: () => viewArticle(featured.slug)
                }, featured.title),
                e('p', { className: 'featured-blog-excerpt' }, featured.shortDesc),
                e('div', { className: 'blog-tags-row' },
                  (featured.tags || []).slice(0, 4).map((tag, idx) =>
                    e('span', { key: idx, className: 'blog-tag-pill' }, `#${tag}`)
                  )
                ),
                e('div', { className: 'featured-blog-actions' },
                  e('button', {
                    className: 'btn btn-primary',
                    onClick: () => viewArticle(featured.slug)
                  },
                    'Read Full Article ', e('i', { className: 'fas fa-arrow-right' })
                  ),
                  e('button', {
                    className: 'btn btn-outline',
                    onClick: () => navigateToPage('blog')
                  },
                    'View All Articles ', e('i', { className: 'fas fa-book-open' })
                  )
                )
              )
            ),

            // Companion Insights Grid
            e('div', { className: 'home-blog-secondary-grid' },
              blogList.filter(b => !b.featured).slice(0, 3).map((item) =>
                e('div', { key: item.id, className: 'blog-mini-card' },
                  e('div', null,
                    e('div', { className: 'blog-mini-category' }, item.category),
                    e('h4', {
                      style: { cursor: 'pointer' },
                      onClick: () => viewArticle(item.slug)
                    }, item.title),
                    e('p', null, item.shortDesc)
                  ),
                  e('div', { className: 'blog-mini-footer' },
                    e('span', null, e('i', { className: 'far fa-clock' }), ' ', item.readTime),
                    e('button', {
                      className: 'blog-link-btn',
                      onClick: () => viewArticle(item.slug)
                    }, 'Read More ', e('i', { className: 'fas fa-chevron-right' }))
                  )
                )
              )
            )
          );
        })()
      )
    )
  );
}

/* 2. ABOUT PAGE */
function AboutPage({ openBooking }) {
  const data = window.CLOVE_DATA;

  return e('div', { className: 'about-page' },
    e('div', { className: 'about-hero' },
      e('div', { className: 'container' },
        e('h1', null, 'About Clove Dental'),
        e('p', null, 'India\'s Largest & Most Trusted Dental Network Committed to Ethical, Painless & High-Precision Dentistry.')
      )
    ),

    e('section', { className: 'section-padding' },
      e('div', { className: 'container' },
        e('div', { className: 'about-content-grid' },
          e('div', { className: 'about-text-block' },
            e('span', { className: 'section-subtitle' }, 'Our Mission & Vision'),
            e('h2', null, 'Transforming Dental Care Across India'),
            e('p', null, 'Clove Dental (Global Health Care Products) was established with a singular vision: to deliver world-class, ethical, standardized, and accessible dental healthcare across India.'),
            e('p', null, 'With over 730+ clinics and a team of 1700+ verified dental specialists, we adhere strictly to evidence-based dental practices, transparent pricing, and unprecedented clinical excellence.'),
            
            e('ul', { className: 'about-feature-list' },
              e('li', { className: 'about-feature-item' }, e('i', { className: 'fas fa-shield-alt' }), ' 10x Sterilization Guarantee'),
              e('li', { className: 'about-feature-item' }, e('i', { className: 'fas fa-user-md' }), ' 1700+ Specialist Dentists'),
              e('li', { className: 'about-feature-item' }, e('i', { className: 'fas fa-hospital-user' }), ' 30 Lakh+ Patients Served'),
              e('li', { className: 'about-feature-item' }, e('i', { className: 'fas fa-calendar-check' }), ' Open 7 Days a Week')
            )
          ),
          e('div', { className: 'about-image-card' },
            e('img', { src: 'assets/clinic_reception.jpg', alt: 'Clove Dental Clinic Interior' })
          )
        ),

        e('div', { className: 'sterilization-box' },
          e('div', { className: 'section-title-wrapper', style: { marginBottom: '1.5rem' } },
            e('span', { className: 'section-subtitle' }, 'Safety & Hygiene'),
            e('h2', null, '4-Step Sterilization & 10x Safety Protocols'),
            e('p', null, 'Your health and safety are our top priority. Every clinic enforces strict hospital-grade sterilisation.')
          ),
          e('div', { className: 'sterilization-grid' },
            e('div', { className: 'sterilization-card' },
              e('i', { className: 'fas fa-pump-medical' }),
              e('h3', null, '1. Decontamination'),
              e('p', null, 'Initial chemical disinfectant dip to kill 99.9% of surface pathogens immediately after use.')
            ),
            e('div', { className: 'sterilization-card' },
              e('i', { className: 'fas fa-soap' }),
              e('h3', null, '2. Ultrasonic Cleaning'),
              e('p', null, 'High-frequency ultrasonic bath removes microscopic debris from fine surgical tools.')
            ),
            e('div', { className: 'sterilization-card' },
              e('i', { className: 'fas fa-box-tissue' }),
              e('h3', null, '3. Hermetic Pouching'),
              e('p', null, 'Instruments are sealed in medical-grade sterile pouches with chemical indicator strips.')
            ),
            e('div', { className: 'sterilization-card' },
              e('i', { className: 'fas fa-temperature-high' }),
              e('h3', null, '4. Class-B Autoclaving'),
              e('p', null, 'High-pressure steam sterilization under 121°C - 134°C kills all bacterial spores completely.')
            )
          )
        )
      )
    )
  );
}

/* 3. DOCTORS PAGE */
function DoctorsPage({ setSelectedDoctor, openBooking }) {
  const data = window.CLOVE_DATA;
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');

  const filteredDoctors = data.doctors.filter(doc => {
    if (selectedLocation !== 'All' && doc.location !== selectedLocation) return false;
    if (selectedSpec !== 'All' && !doc.specialization.toLowerCase().includes(selectedSpec.toLowerCase())) return false;
    if (selectedExp === '10+' && doc.experience < 10) return false;
    if (selectedExp === '15+' && doc.experience < 15) return false;
    if (selectedExp === '20+' && doc.experience < 20) return false;
    return true;
  });

  return e('div', { className: 'doctors-page' },
    e('div', { className: 'about-hero' },
      e('div', { className: 'container' },
        e('h1', null, 'Our Expert Dentists'),
        e('p', null, 'Meet our highly qualified team of 1700+ verified dental specialists dedicated to your smile.')
      )
    ),

    e('section', { className: 'section-padding' },
      e('div', { className: 'container' },
        e('div', { className: 'filter-bar' },
          e('div', { className: 'filter-group' },
            e('label', null, e('i', { className: 'fas fa-map-marker-alt' }), ' Location'),
            e('select', { className: 'filter-select', value: selectedLocation, onChange: (e) => setSelectedLocation(e.target.value) },
              e('option', { value: 'All' }, 'All Cities'),
              e('option', { value: 'Hyderabad' }, 'Hyderabad'),
              e('option', { value: 'Delhi' }, 'Delhi'),
              e('option', { value: 'Bengaluru' }, 'Bengaluru'),
              e('option', { value: 'Mumbai' }, 'Mumbai')
            )
          ),
          e('div', { className: 'filter-group' },
            e('label', null, e('i', { className: 'fas fa-stethoscope' }), ' Specialization'),
            e('select', { className: 'filter-select', value: selectedSpec, onChange: (e) => setSelectedSpec(e.target.value) },
              e('option', { value: 'All' }, 'All Specializations'),
              e('option', { value: 'General Dentistry' }, 'General Dentistry'),
              e('option', { value: 'Periodontist' }, 'Periodontist (Gum Care)'),
              e('option', { value: 'Pedodontist' }, 'Pedodontist (Kids Care)'),
              e('option', { value: 'Orthodontics' }, 'Orthodontics (Braces/Aligners)'),
              e('option', { value: 'Endodontics' }, 'Endodontics (Root Canal)'),
              e('option', { value: 'Prosthodontics' }, 'Prosthodontics (Crowns/Implants)')
            )
          ),
          e('div', { className: 'filter-group' },
            e('label', null, e('i', { className: 'fas fa-award' }), ' Clinical Experience'),
            e('select', { className: 'filter-select', value: selectedExp, onChange: (e) => setSelectedExp(e.target.value) },
              e('option', { value: 'All' }, 'Any Experience'),
              e('option', { value: '10+' }, '10+ Years'),
              e('option', { value: '15+' }, '15+ Years'),
              e('option', { value: '20+' }, '20+ Years')
            )
          )
        ),

        e('div', { className: 'doctors-grid' },
          filteredDoctors.map(doc =>
            e('div', { key: doc.id, className: 'doctor-card' },
              e('div', { className: 'doctor-img-wrapper' },
                e('img', { src: doc.image, alt: doc.name }),
                e('span', { className: 'doctor-exp-badge' }, `${doc.experience} Years Exp.`)
              ),
              e('div', { className: 'doctor-body' },
                e('h3', { className: 'doctor-name' }, doc.name),
                e('div', { className: 'doctor-qual' }, doc.qualification),
                e('div', { className: 'doctor-info-item' },
                  e('i', { className: 'fas fa-user-doctor' }),
                  e('span', null, e('strong', null, 'Spec: '), doc.specialization)
                ),
                e('div', { className: 'doctor-info-item' },
                  e('i', { className: 'fas fa-location-dot' }),
                  e('span', null, e('strong', null, 'Clinic: '), `${doc.area}, ${doc.location}`)
                ),
                e('div', { className: 'doctor-info-item' },
                  e('i', { className: 'fas fa-calendar-days' }),
                  e('span', null, doc.availableDays)
                ),
                e('div', { className: 'doctor-expertise-chips' },
                  doc.expertise.map((exp, i) => e('span', { key: i, className: 'expertise-chip' }, exp))
                ),
                e('div', { className: 'doctor-actions' },
                  e('button', { className: 'btn btn-outline btn-sm', onClick: () => setSelectedDoctor(doc) }, 'View Profile'),
                  e('button', { className: 'btn btn-primary btn-sm', onClick: () => openBooking({ doctor: doc.name, city: doc.location }) }, 'Book Visit')
                )
              )
            )
          )
        )
      )
    )
  );
}

/* 4. SERVICES PAGE */
function ServicesPage({ openBooking }) {
  const data = window.CLOVE_DATA;

  return e('div', { className: 'services-page' },
    e('div', { className: 'about-hero' },
      e('div', { className: 'container' },
        e('h1', null, 'Official Clove Dental Services'),
        e('p', null, 'Comprehensive spectrum of dental specialties delivered by verified experts with advanced technology.')
      )
    ),

    e('section', { className: 'section-padding' },
      e('div', { className: 'container' },
        e('div', { className: 'services-grid' },
          data.services.map(srv =>
            e('div', { key: srv.id, className: 'service-card' },
              e('div', { className: 'service-icon-box' }, e('i', { className: `fas ${srv.icon}` })),
              e('h3', null, srv.title),
              e('p', null, srv.description),
              e('ul', { className: 'service-features-list' },
                srv.features.map((feat, idx) =>
                  e('li', { key: idx, className: 'service-feature-item' },
                    e('i', { className: 'fas fa-check' }), ' ', feat
                  )
                )
              ),
              e('button', {
                className: 'btn btn-outline btn-sm',
                style: { marginTop: 'auto', width: '100%' },
                onClick: () => openBooking({ service: srv.title })
              }, 'Book Consultation')
            )
          )
        )
      )
    )
  );
}

/* 5. TREATMENTS PAGE */
function TreatmentsPage({ setSelectedTreatment, openBooking }) {
  const data = window.CLOVE_DATA;

  return e('div', { className: 'treatments-page' },
    e('div', { className: 'about-hero' },
      e('div', { className: 'container' },
        e('h1', null, 'Specialized Dental Treatments'),
        e('p', null, 'Evidence-based, gentle treatment options designed for your comfort and long-term oral health.')
      )
    ),

    e('section', { className: 'section-padding' },
      e('div', { className: 'container' },
        e('div', { className: 'treatments-grid' },
          data.treatments.map(trt =>
            e('div', { key: trt.id, className: 'treatment-card' },
              e('img', { src: trt.image, alt: trt.title, className: 'treatment-img' }),
              e('div', { className: 'treatment-body' },
                e('span', { className: 'treatment-tag' }, trt.category),
                e('h3', null, trt.title),
                e('p', null, trt.shortDesc),
                e('div', { className: 'who-needs-box' },
                  e('strong', null, 'Who may need it: '), trt.whoNeedsIt
                ),
                e('ul', { className: 'treatment-detail-list' },
                  trt.benefits.slice(0, 3).map((b, i) =>
                    e('li', { key: i, className: 'treatment-detail-item' },
                      e('i', { className: 'fas fa-check-circle' }), ' ', b
                    )
                  )
                ),
                e('div', { className: 'treatment-footer' },
                  e('button', { className: 'btn btn-outline btn-sm', onClick: () => setSelectedTreatment(trt) }, 'Learn More'),
                  e('button', { className: 'btn btn-primary btn-sm', onClick: () => openBooking({ treatment: trt.title }) }, 'Book Appointment')
                )
              )
            )
          )
        )
      )
    )
  );
}

/* 6. GALLERY PAGE */
function GalleryPage({ setSelectedGalleryItem }) {
  const data = window.CLOVE_DATA;
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredItems = activeFilter === 'All'
    ? data.gallery
    : data.gallery.filter(item => item.category === activeFilter);

  return e('div', { className: 'gallery-page' },
    e('div', { className: 'about-hero' },
      e('div', { className: 'container' },
        e('h1', null, 'Clinic & Care Gallery'),
        e('p', null, 'Take a tour of our modern facilities, sterile treatment rooms, and advanced dental technology.')
      )
    ),

    e('section', { className: 'section-padding' },
      e('div', { className: 'container' },
        e('div', { className: 'gallery-filters' },
          ['All', 'Clinics & Reception', 'Treatment Rooms', 'Doctors & Care', 'Dental Technology'].map((cat, idx) =>
            e('button', {
              key: idx,
              className: `filter-btn ${activeFilter === cat ? 'active' : ''}`,
              onClick: () => setActiveFilter(cat)
            }, cat)
          )
        ),
        e('div', { className: 'gallery-grid' },
          filteredItems.map(item =>
            e('div', { key: item.id, className: 'gallery-card', onClick: () => setSelectedGalleryItem(item) },
              e('img', { src: item.image, alt: item.title }),
              e('div', { className: 'gallery-overlay' },
                e('h4', null, item.title),
                e('p', null, item.category)
              )
            )
          )
        )
      )
    )
  );
}

/* 7. TESTIMONIALS PAGE */
function TestimonialsPage({ openBooking }) {
  const data = window.CLOVE_DATA;

  return e('div', { className: 'testimonials-page' },
    e('div', { className: 'about-hero' },
      e('div', { className: 'container' },
        e('h1', null, 'Patient Testimonials'),
        e('p', null, 'Read real stories and verified reviews from over 30 Lakh+ happy smiles across India.')
      )
    ),

    e('section', { className: 'section-padding' },
      e('div', { className: 'container' },
        e('div', { className: 'testimonials-grid' },
          data.testimonials.map(tst =>
            e('div', { key: tst.id, className: 'testimonial-card' },
              e('i', { className: 'fas fa-quote-right quote-icon' }),
              e('div', { className: 'star-rating' },
                [...Array(tst.rating)].map((_, i) => e('i', { key: i, className: 'fas fa-star' }))
              ),
              e('p', { className: 'testimonial-text' }, `"${tst.review}"`),
              e('div', { className: 'patient-info' },
                e('div', { className: 'patient-avatar' }, tst.patientName.charAt(0)),
                e('div', { className: 'patient-details' },
                  e('h4', null, tst.patientName),
                  e('p', null, `${tst.location} • ${tst.treatment}`)
                )
              )
            )
          )
        )
      )
    )
  );
}

/* 8. CONTACT PAGE */
function ContactPage({ openBooking }) {
  const data = window.CLOVE_DATA.contactInfo;
  const clinics = window.CLOVE_DATA.clinics;
  
  const [searchCity, setSearchCity] = useState('All');
  const [searchArea, setSearchArea] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filteredClinics = clinics.filter(c => {
    if (searchCity !== 'All' && c.city !== searchCity) return false;
    if (searchArea && !c.area.toLowerCase().includes(searchArea.toLowerCase()) && !c.address.toLowerCase().includes(searchArea.toLowerCase()) && !c.pincode.includes(searchArea)) return false;
    return true;
  });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setFormSubmitted(true);
  };

  return e('div', { className: 'contact-page' },
    e('div', { className: 'about-hero' },
      e('div', { className: 'container' },
        e('h1', null, 'Contact Clove Dental'),
        e('p', null, 'Get in touch with our headquarters or find your nearest Clove Dental clinic location.')
      )
    ),

    e('section', { className: 'section-padding' },
      e('div', { className: 'container' },
        e('div', { className: 'contact-grid', style: { marginBottom: '4rem' } },
          e('div', { className: 'contact-info-card' },
            e('span', { className: 'section-subtitle' }, 'Head Office'),
            e('h2', { style: { fontSize: '1.75rem', marginBottom: '1.5rem' } }, 'Get in Touch'),
            e('div', { className: 'info-item' },
              e('div', { className: 'info-icon' }, e('i', { className: 'fas fa-building' })),
              e('div', { className: 'info-text' },
                e('h4', null, 'Head Office Address'),
                e('p', null, data.headOffice)
              )
            ),
            e('div', { className: 'info-item' },
              e('div', { className: 'info-icon' }, e('i', { className: 'fas fa-clock' })),
              e('div', { className: 'info-text' },
                e('h4', null, 'Timings'),
                e('p', null, e('strong', null, 'Headquarters: '), data.hqTimings),
                e('p', null, e('strong', null, 'Clinics: '), data.clinicTimings)
              )
            ),
            e('div', { className: 'info-item' },
              e('div', { className: 'info-icon' }, e('i', { className: 'fas fa-envelope' })),
              e('div', { className: 'info-text' },
                e('h4', null, 'Email Queries'),
                e('p', null, 'General: ', e('a', { href: `mailto:${data.generalEmail}` }, data.generalEmail)),
                e('p', null, 'Patient Care: ', e('a', { href: `mailto:${data.patientCareEmail}` }, data.patientCareEmail))
              )
            ),
            e('div', { className: 'info-item' },
              e('div', { className: 'info-icon' }, e('i', { className: 'fas fa-phone-volume' })),
              e('div', { className: 'info-text' },
                e('h4', null, 'Dental Helpline'),
                e('p', null, 'North India: ', e('strong', null, data.helplineNorth)),
                e('p', null, 'South India: ', e('strong', null, data.helplineSouth))
              )
            )
          ),

          e('div', { className: 'contact-form-card' },
            e('h3', { style: { fontSize: '1.5rem', marginBottom: '1.25rem' } }, 'Send Us a Message'),
            formSubmitted ?
              e('div', { style: { padding: '2rem', textAlign: 'center', background: 'var(--primary-teal-light)', borderRadius: 'var(--radius-md)' } },
                e('i', { className: 'fas fa-check-circle', style: { fontSize: '3rem', color: '#10B981', marginBottom: '1rem' } }),
                e('h3', null, 'Thank You for Contacting Us!'),
                e('p', null, 'Our patient care team will get back to you within 2 business hours.')
              ) :
              e('form', { onSubmit: handleSubmit },
                e('div', { className: 'form-group' },
                  e('label', null, 'Full Name *'),
                  e('input', { type: 'text', required: true, className: 'form-control', placeholder: 'Enter your full name' })
                ),
                e('div', { className: 'form-group' },
                  e('label', null, 'Phone Number *'),
                  e('input', { type: 'tel', required: true, className: 'form-control', placeholder: 'Enter 10-digit mobile number' })
                ),
                e('div', { className: 'form-group' },
                  e('label', null, 'Email Address'),
                  e('input', { type: 'email', className: 'form-control', placeholder: 'Enter email address' })
                ),
                e('div', { className: 'form-group' },
                  e('label', null, 'Your Message / Query *'),
                  e('textarea', { required: true, className: 'form-control', placeholder: 'How can we help you?' })
                ),
                e('div', { style: { display: 'flex', gap: '1rem', flexWrap: 'wrap' } },
                  e('button', { type: 'submit', className: 'btn btn-primary' }, 'Submit Query'),
                  e('button', { type: 'button', className: 'btn btn-outline', onClick: () => openBooking() }, 'Book Appointment')
                )
              )
          )
        ),

        e('div', { className: 'clinic-finder-box' },
          e('span', { className: 'section-subtitle' }, 'Clinic Finder'),
          e('h2', null, 'Locate a Clove Dental Clinic Near You'),
          e('p', null, 'Search over 730+ verified clinic addresses in Hyderabad, Delhi, Bengaluru, Mumbai, Chennai, and more.'),
          e('div', { className: 'search-controls' },
            e('div', { className: 'filter-group' },
              e('label', null, 'Select City'),
              e('select', { className: 'filter-select', value: searchCity, onChange: (ev) => setSearchCity(ev.target.value) },
                e('option', { value: 'All' }, 'All Cities'),
                e('option', { value: 'Hyderabad' }, 'Hyderabad'),
                e('option', { value: 'Delhi' }, 'Delhi'),
                e('option', { value: 'Bengaluru' }, 'Bengaluru'),
                e('option', { value: 'Mumbai' }, 'Mumbai'),
                e('option', { value: 'Chennai' }, 'Chennai')
              )
            ),
            e('div', { className: 'filter-group' },
              e('label', null, 'Area or Pincode'),
              e('input', {
                type: 'text',
                className: 'filter-select',
                placeholder: 'e.g. Jubilee Hills, 500033...',
                value: searchArea,
                onChange: (ev) => setSearchArea(ev.target.value)
              })
            )
          )
        ),

        e('div', { className: 'clinics-list-grid' },
          filteredClinics.map(c =>
            e('div', { key: c.id, className: 'clinic-card' },
              e('h3', null, c.name),
              e('div', { className: 'clinic-card-meta' },
                e('div', { style: { display: 'flex', gap: '0.6rem' } },
                  e('i', { className: 'fas fa-location-dot', style: { color: 'var(--primary-teal)', marginTop: '4px' } }),
                  e('span', null, c.address)
                ),
                e('div', { style: { display: 'flex', gap: '0.6rem' } },
                  e('i', { className: 'fas fa-phone', style: { color: 'var(--primary-teal)' } }),
                  e('span', null, c.phone)
                ),
                e('div', { style: { display: 'flex', gap: '0.6rem' } },
                  e('i', { className: 'fas fa-clock', style: { color: 'var(--primary-teal)' } }),
                  e('span', null, c.timings)
                )
              ),
              e('div', { style: { display: 'flex', gap: '0.5rem', marginTop: 'auto' } },
                e('a', { href: c.mapUrl, target: '_blank', rel: 'noreferrer', className: 'btn btn-outline btn-sm', style: { flex: 1 } },
                  e('i', { className: 'fas fa-directions' }), ' Directions'
                ),
                e('button', { className: 'btn btn-primary btn-sm', style: { flex: 1 }, onClick: () => openBooking({ city: c.city, clinic: c.name }) }, 'Book Visit')
              )
            )
          )
        )
      )
    )
  );
}
/* 8. BLOG PAGES */

/* DEDICATED BLOG LISTING PAGE */
function BlogPage({ setActivePage, viewArticle, openBooking, navigateToPage }) {
  const data = window.CLOVE_DATA;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Dental Health & Prevention', 'Treatments & Procedures', 'Restorative Dentistry'];

  const blogList = data.blogs || [];
  const filteredBlogs = blogList.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.tags && blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = blogList.find(b => b.featured) || blogList[0];

  return e('div', { className: 'blog-listing-page' },
    // Hero Header
    e('section', { className: 'blog-listing-hero' },
      e('div', { className: 'container' },
        e('div', { className: 'blog-hero-content' },
          e('div', { className: 'blog-hero-badge' },
            e('i', { className: 'fas fa-newspaper' }), ' Clove Dental Health Editorial'
          ),
          e('h1', null, 'Dental Health & Wellness Blog'),
          e('p', null, 'Expert clinical guides, preventive oral healthcare tips, and the latest treatment insights written and reviewed by experienced dental specialists.')
        )
      )
    ),

    // Search and Filter Bar
    e('section', { className: 'blog-controls-bar' },
      e('div', { className: 'container' },
        e('div', { className: 'blog-controls-wrapper' },
          e('div', { className: 'blog-search-box' },
            e('i', { className: 'fas fa-search' }),
            e('input', {
              type: 'text',
              placeholder: 'Search dental articles, treatments, tips...',
              value: searchQuery,
              onChange: (ev) => setSearchQuery(ev.target.value)
            })
          ),
          e('div', { className: 'blog-category-pills' },
            categories.map(cat =>
              e('button', {
                key: cat,
                className: `category-filter-btn ${selectedCategory === cat ? 'active' : ''}`,
                onClick: () => setSelectedCategory(cat)
              }, cat)
            )
          )
        )
      )
    ),

    // Blog Listing Grid
    e('section', { className: 'section-padding', style: { paddingTop: '3rem' } },
      e('div', { className: 'container' },
        // Featured Highlight (if in All and no search)
        selectedCategory === 'All' && !searchQuery.trim() && featuredBlog &&
          e('div', { className: 'featured-blog-banner', style: { marginBottom: '3.5rem' } },
            e('div', { className: 'featured-blog-media' },
              e('img', { src: featuredBlog.image, alt: featuredBlog.imageAlt || featuredBlog.title }),
              e('div', { className: 'featured-blog-badge-overlay' },
                e('i', { className: 'fas fa-star' }), ' Featured Clinical Guide'
              )
            ),
            e('div', { className: 'featured-blog-content' },
              e('div', { className: 'blog-meta-row' },
                e('div', { className: 'blog-meta-item' },
                  e('i', { className: 'fas fa-user-edit' }), ' By ', e('strong', null, featuredBlog.submittedBy)
                ),
                e('div', { className: 'blog-meta-item' },
                  e('i', { className: 'far fa-clock' }), ' ', featuredBlog.readTime
                ),
                e('div', { className: 'blog-meta-item' },
                  e('i', { className: 'fas fa-folder-open' }), ' ', featuredBlog.category
                )
              ),
              e('h2', {
                className: 'featured-blog-title',
                style: { cursor: 'pointer' },
                onClick: () => viewArticle(featuredBlog.slug)
              }, featuredBlog.title),
              e('p', { className: 'featured-blog-excerpt' }, featuredBlog.shortDesc),
              e('div', { className: 'blog-tags-row' },
                (featuredBlog.tags || []).slice(0, 5).map((t, i) =>
                  e('span', { key: i, className: 'blog-tag-pill' }, `#${t}`)
                )
              ),
              e('div', { className: 'featured-blog-actions' },
                e('button', {
                  className: 'btn btn-primary',
                  onClick: () => viewArticle(featuredBlog.slug)
                }, 'Read Full Article ', e('i', { className: 'fas fa-arrow-right' })),
                e('button', {
                  className: 'btn btn-outline',
                  onClick: () => openBooking()
                }, 'Book Consultation')
              )
            )
          ),

        // Section Title for Articles
        e('div', { className: 'section-title-wrapper', style: { marginBottom: '2rem', textAlign: 'left' } },
          e('h3', { style: { fontSize: '1.65rem' } },
            searchQuery ? `Search Results for "${searchQuery}" (${filteredBlogs.length})` :
            selectedCategory === 'All' ? 'All Dental Articles & Guides' : `${selectedCategory} Articles (${filteredBlogs.length})`
          )
        ),

        filteredBlogs.length === 0 ?
          e('div', { style: { textAlign: 'center', padding: '4rem 1rem', background: '#FFFFFF', borderRadius: 'var(--radius-lg)' } },
            e('i', { className: 'fas fa-search', style: { fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' } }),
            e('h3', null, 'No articles found'),
            e('p', null, 'Try a different search term or category filter.'),
            e('button', {
              className: 'btn btn-outline',
              style: { marginTop: '1.25rem' },
              onClick: () => { setSearchQuery(''); setSelectedCategory('All'); }
            }, 'Reset Filters')
          ) :
          e('div', { className: 'blog-cards-grid' },
            filteredBlogs.map(blog =>
              e('div', { key: blog.id, className: 'blog-card' },
                e('div', { className: 'blog-card-media', onClick: () => viewArticle(blog.slug), style: { cursor: 'pointer' } },
                  e('img', { src: blog.image, alt: blog.imageAlt || blog.title }),
                  e('span', { className: 'blog-card-category-badge' }, blog.category)
                ),
                e('div', { className: 'blog-card-body' },
                  e('div', { className: 'blog-meta-row', style: { marginBottom: '0.65rem' } },
                    e('div', { className: 'blog-meta-item' }, e('i', { className: 'fas fa-user' }), ' ', blog.submittedBy.split('(')[0]),
                    e('div', { className: 'blog-meta-item' }, e('i', { className: 'far fa-clock' }), ' ', blog.readTime)
                  ),
                  e('h3', {
                    style: { cursor: 'pointer' },
                    onClick: () => viewArticle(blog.slug)
                  }, blog.title),
                  e('p', null, blog.shortDesc),
                  e('div', { className: 'blog-card-footer' },
                    e('button', {
                      className: 'blog-link-btn',
                      onClick: () => viewArticle(blog.slug)
                    }, 'Read More ', e('i', { className: 'fas fa-chevron-right' })),
                    e('span', { style: { fontSize: '0.8rem', color: 'var(--text-light)' } }, blog.publishedDate)
                  )
                )
              )
            )
          )
      )
    ),

    // Banner CTA
    e('section', { style: { padding: '0 0 5rem 0' } },
      e('div', { className: 'container' },
        e('div', { className: 'article-cta-banner', style: { margin: 0 } },
          e('span', { className: 'article-cta-badge' }, e('i', { className: 'fas fa-tooth' }), ' Trusted by 30 Lakh+ Patients'),
          e('h3', null, 'Take the Next Step Towards a Healthier Smile'),
          e('p', null, 'Book a comprehensive dental consultation at your nearest Clove Dental clinic today and receive personalized care from India\'s leading dental specialists.'),
          e('button', {
            className: 'btn-cta-large',
            onClick: () => openBooking()
          }, e('i', { className: 'fas fa-calendar-check' }), ' BOOK A DENTAL CONSULTATION')
        )
      )
    )
  );
}

/* FULL BLOG ARTICLE PAGE (PRESERVING COMPLETE ORIGINAL PDF CONTENT) */
function BlogArticlePage({ slug, setActivePage, openBooking, setSelectedTreatment, viewArticle, navigateToPage }) {
  const data = window.CLOVE_DATA;
  const blogList = data.blogs || [];
  const blog = blogList.find(b => b.slug === slug) || blogList[0];

  const [activeFaq, setActiveFaq] = useState(0);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!blog) return null;

  return e('article', { className: 'article-page' },
    // Breadcrumbs
    e('div', { className: 'article-breadcrumb-bar' },
      e('div', { className: 'container' },
        e('div', { className: 'article-breadcrumb' },
          e('a', { href: '#home', onClick: (ev) => { ev.preventDefault(); navigateToPage('home'); } }, 'Home'),
          e('i', { className: 'fas fa-chevron-right' }),
          e('a', { href: '#blog', onClick: (ev) => { ev.preventDefault(); navigateToPage('blog'); } }, 'Blog'),
          e('i', { className: 'fas fa-chevron-right' }),
          e('span', { style: { color: 'var(--text-dark)', fontWeight: '600' } }, blog.title)
        )
      )
    ),

    // Article Header
    e('header', { className: 'article-header-section' },
      e('div', { className: 'container' },
        e('div', { className: 'article-doc-badge' },
          e('i', { className: 'fas fa-file-lines' }),
          ' Submitted By: ', e('strong', null, blog.submittedBy), ' | Brand: ', e('strong', null, blog.brand), ' | ', blog.documentType
        ),
        e('h1', { className: 'article-main-title' }, blog.title),
        e('p', { className: 'article-lead-subtitle' }, blog.subtitle),

        e('div', { className: 'article-meta-card' },
          e('div', { className: 'article-author-info' },
            e('div', { className: 'author-avatar' }, 'P'),
            e('div', { className: 'author-details' },
              e('h4', null, blog.submittedBy),
              e('p', null, 'Clove Dental Healthcare & SEO Specialist • Reviewed by Dental Editorial Board')
            )
          ),

          e('div', { className: 'article-metrics' },
            e('div', null, e('i', { className: 'far fa-clock' }), ' ', e('strong', null, blog.readTime)),
            e('div', null, e('i', { className: 'far fa-calendar' }), ' ', blog.publishedDate),
            e('div', null, e('i', { className: 'fas fa-shield-halved', style: { color: '#10B981' } }), ' Doctor Verified')
          ),

          e('div', { className: 'article-share-actions' },
            e('button', {
              className: 'share-btn',
              title: 'Copy Link',
              onClick: handleCopyLink
            }, e('i', { className: copiedLink ? 'fas fa-check' : 'fas fa-link' })),
            copiedLink && e('span', { style: { fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: '700' } }, 'Copied!'),
            e('a', {
              className: 'share-btn',
              title: 'Share on WhatsApp',
              href: `https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`,
              target: '_blank',
              rel: 'noreferrer'
            }, e('i', { className: 'fab fa-whatsapp' })),
            e('a', {
              className: 'share-btn',
              title: 'Share on Twitter',
              href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`,
              target: '_blank',
              rel: 'noreferrer'
            }, e('i', { className: 'fab fa-x-twitter' })),
            e('a', {
              className: 'share-btn',
              title: 'Share on LinkedIn',
              href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
              target: '_blank',
              rel: 'noreferrer'
            }, e('i', { className: 'fab fa-linkedin-in' }))
          )
        )
      )
    ),

    // Main Container with Hero Image & 2-Column Content
    e('div', { className: 'container' },
      // Article Hero Media & Slogan Banner (Faithful to Page 1 of PDF)
      e('div', { className: 'article-hero-media' },
        e('img', { src: blog.image, alt: blog.imageAlt }),
        e('div', { className: 'article-hero-banner-box' },
          e('h3', null,
            e('i', { className: 'fas fa-tooth' }),
            ' Healthy teeth. Confident smile.'
          ),
          e('div', { className: 'article-hero-banner-pills' },
            e('span', null, 'Prevention'),
            e('span', null, 'Treatment'),
            e('span', null, 'Care')
          )
        )
      ),

      // 2-Column Layout (Sidebar Table of Contents + Main Body)
      e('div', { className: 'article-layout-grid' },
        // Left Sticky Sidebar
        e('aside', { className: 'article-sidebar' },
          // Table of Contents
          e('div', { className: 'sidebar-widget' },
            e('div', { className: 'sidebar-widget-title' },
              e('i', { className: 'fas fa-list-ul' }), ' Table of Contents'
            ),
            e('ul', { className: 'toc-list' },
              e('li', null, e('a', { href: '#intro', className: 'toc-link' }, 'Introduction & Target Audience')),
              e('li', null, e('a', { href: '#importance', className: 'toc-link' }, 'Why Dental Care Is Important')),
              e('li', null, e('a', { href: '#problems', className: 'toc-link' }, 'Common Dental Problems')),
              e('li', null, e('a', { href: '#services', className: 'toc-link' }, 'Dental Services & Treatments')),
              e('li', null, e('a', { href: '#benefits', className: 'toc-link' }, 'Benefits at a Glance Table')),
              e('li', null, e('a', { href: '#choose-clinic', className: 'toc-link' }, 'How to Choose Right Clinic')),
              e('li', null, e('a', { href: '#why-clove', className: 'toc-link' }, 'Why Choose Clove Dental')),
              e('li', null, e('a', { href: '#how-to-book', className: 'toc-link' }, 'Step-by-Step Booking')),
              e('li', null, e('a', { href: '#tips', className: 'toc-link' }, '6 Habits for Healthy Teeth')),
              e('li', null, e('a', { href: '#warning-signs', className: 'toc-link' }, 'Signs You Must Not Ignore')),
              e('li', null, e('a', { href: '#faqs', className: 'toc-link' }, 'Frequently Asked Questions')),
              e('li', null, e('a', { href: '#cta', className: 'toc-link' }, 'Book Dental Consultation')),
              e('li', null, e('a', { href: '#marketing-report', className: 'toc-link' }, 'Marketing & SEO Report'))
            )
          ),

          // Sidebar CTA Widget
          e('div', { className: 'sidebar-cta-card' },
            e('i', { className: 'fas fa-calendar-check cta-icon' }),
            e('h4', null, 'Need Dental Care?'),
            e('p', null, 'Consult with 1,700+ specialist dentists across 730+ Clove Dental clinics.'),
            e('button', {
              className: 'btn btn-primary',
              style: { width: '100%', background: 'var(--accent-orange)' },
              onClick: () => openBooking()
            }, 'Book Appointment')
          ),

          // Quick Author Profile
          e('div', { className: 'sidebar-widget' },
            e('div', { className: 'sidebar-widget-title' },
              e('i', { className: 'fas fa-user-pen' }), ' Author Profile'
            ),
            e('p', { style: { fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' } },
              e('strong', null, 'Pranathi'), ' is an SEO and Healthcare Content Specialist focusing on evidence-based dental education, preventive oral health, and patient-centric guides for Clove Dental.'
            )
          )
        ),

        // Right Main Content Column
        e('div', { className: 'article-main-body' },

          /* 1. INTRODUCTION */
          e('section', { id: 'intro', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Introduction'),
            (blog.intro.paragraphs || []).map((p, idx) =>
              e('p', { key: idx, className: 'article-text-p' }, p)
            ),

            e('div', { className: 'article-callout-box' },
              e('i', { className: 'fas fa-heart-pulse' }),
              e('div', { className: 'article-callout-content' },
                e('strong', null, 'Core Mission'),
                e('p', null, blog.intro.heroBanner || "Healthy teeth and a confident smile start with regular dental care.")
              )
            ),

            e('h3', { style: { fontSize: '1.4rem', margin: '2rem 0 1rem 0' } }, 'Who This Blog Is For'),
            e('p', { className: 'article-text-p' }, 'This comprehensive guide is designed for individuals and families at every stage of their oral health journey:'),
            e('div', { className: 'target-audience-grid' },
              (blog.whoThisBlogIsFor || []).map((item, idx) =>
                e('div', { key: idx, className: 'target-audience-item' },
                  e('i', { className: 'fas fa-circle-check' }),
                  e('span', null, item)
                )
              )
            )
          ),

          /* 2. WHY DENTAL CARE IS IMPORTANT */
          e('section', { id: 'importance', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Why Dental Care Is Important'),
            e('p', { className: 'article-text-p' }, blog.whyDentalCareIsImportant.lead),

            e('div', { className: 'article-callout-box' },
              e('i', { className: 'fas fa-lightbulb' }),
              e('div', { className: 'article-callout-content' },
                e('strong', null, 'Key Point'),
                e('p', null, blog.whyDentalCareIsImportant.keyPoint)
              )
            ),

            e('h4', { style: { fontSize: '1.15rem', margin: '1.5rem 0 1rem 0' } }, 'Key Benefits of Routine Professional Dental Care:'),
            e('div', { className: 'target-audience-grid' },
              (blog.whyDentalCareIsImportant.benefits || []).map((benefit, idx) =>
                e('div', { key: idx, className: 'target-audience-item' },
                  e('i', { className: 'fas fa-shield-halved' }),
                  e('span', null, benefit)
                )
              )
            )
          ),

          /* 3. COMMON DENTAL PROBLEMS */
          e('section', { id: 'problems', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Common Dental Problems'),
            e('p', { className: 'article-text-p' }, blog.commonDentalProblems.intro),

            // Visual illustrations matching Page 2 of PDF
            e('div', { className: 'problems-illustrations-grid' },
              (blog.commonDentalProblems.illustrations || []).map((ill, idx) =>
                e('div', { key: idx, className: `problem-illustration-card ${ill.status}` },
                  e('div', { className: 'problem-illustration-icon' },
                    e('i', { className: `fas ${ill.icon}` })
                  ),
                  e('h4', null, ill.title),
                  e('p', null, ill.desc)
                )
              )
            ),

            e('p', { style: { fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center', marginBottom: '1.5rem' } },
              'Illustration: a healthy tooth, tooth decay and gum problems'
            ),

            // Detailed Problems List
            e('div', { className: 'dental-problems-list' },
              (blog.commonDentalProblems.items || []).map((item, idx) =>
                e('div', { key: idx, className: 'problem-list-item' },
                  e('i', { className: `fas ${item.icon}` }),
                  e('div', null,
                    e('strong', null, item.name, ': '),
                    e('span', null, item.desc)
                  )
                )
              )
            ),

            e('div', { className: 'article-callout-box' },
              e('i', { className: 'fas fa-clock-rotate-left' }),
              e('div', { className: 'article-callout-content' },
                e('strong', null, 'Why it matters'),
                e('p', null, blog.commonDentalProblems.whyItMatters)
              )
            )
          ),

          /* 4. DENTAL SERVICES & TREATMENTS */
          e('section', { id: 'services', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Dental Services & Treatments'),
            e('p', { className: 'article-text-p' }, blog.servicesAndTreatments.intro),

            e('div', { className: 'treatments-article-grid' },
              (blog.servicesAndTreatments.items || []).map((item, idx) =>
                e('div', { key: idx, className: 'treatment-article-card' },
                  e('div', { className: 'treatment-article-card-header' },
                    e('i', { className: `fas ${item.icon}` }),
                    e('span', { className: 'treatment-tag' }, item.tag)
                  ),
                  e('h4', null, item.title),
                  e('p', null, item.desc),
                  e('div', { style: { marginTop: '1rem', display: 'flex', gap: '0.5rem' } },
                    e('button', {
                      className: 'btn btn-outline btn-sm',
                      onClick: () => {
                        const trtMatch = data.treatments.find(t => t.title.toLowerCase().includes(item.title.toLowerCase().split('/')[0].trim()));
                        if (trtMatch) setSelectedTreatment(trtMatch);
                        else openBooking({ treatment: item.title });
                      }
                    }, 'Treatment Details'),
                    e('button', {
                      className: 'btn btn-primary btn-sm',
                      onClick: () => openBooking({ treatment: item.title })
                    }, 'Book')
                  )
                )
              )
            )
          ),

          /* 5. DENTAL CARE BENEFITS AT A GLANCE */
          e('section', { id: 'benefits', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Dental Care Benefits at a Glance'),
            e('p', { className: 'article-text-p' }, 'Here is a quick summary comparing key dental clinic treatments, how they resolve oral health issues, and their lasting patient benefits:'),

            e('div', { className: 'benefits-table-wrapper' },
              e('table', { className: 'benefits-table' },
                e('thead', null,
                  e('tr', null,
                    e('th', null, 'Treatment'),
                    e('th', null, 'How It Helps'),
                    e('th', null, 'Key Benefit')
                  )
                ),
                e('tbody', null,
                  (blog.benefitsTable || []).map((row, idx) =>
                    e('tr', { key: idx },
                      e('td', null, e('strong', null, row.treatment)),
                      e('td', null, row.howItHelps),
                      e('td', null, e('span', { className: 'benefit-badge' }, row.keyBenefit))
                    )
                  )
                )
              )
            ),

            e('div', { className: 'article-callout-box' },
              e('i', { className: 'fas fa-user-check' }),
              e('div', { className: 'article-callout-content' },
                e('strong', null, 'Key Point'),
                e('p', null, blog.benefitsKeyPoint)
              )
            )
          ),

          /* 6. HOW TO CHOOSE THE RIGHT DENTAL CLINIC */
          e('section', { id: 'choose-clinic', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'How to Choose the Right Dental Clinic'),
            e('p', { className: 'article-text-p' }, blog.howToChooseClinic.intro),

            e('div', { className: 'clinic-checklist' },
              (blog.howToChooseClinic.factors || []).map((factor, idx) =>
                e('div', { key: idx, className: 'clinic-checklist-item' },
                  e('i', { className: 'fas fa-circle-check' }),
                  e('span', null, factor)
                )
              )
            )
          ),

          /* 7. WHY CHOOSE CLOVE DENTAL */
          e('section', { id: 'why-clove', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Why Choose Clove Dental'),
            e('p', { className: 'article-text-p' }, blog.whyChooseClove.intro),

            e('h4', { style: { fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-teal-dark)' } }, 'Services and Treatment Options'),
            e('p', { className: 'article-text-p' }, blog.whyChooseClove.servicesDesc),

            e('h4', { style: { fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-teal-dark)' } }, 'Doctors and Technology'),
            e('p', { className: 'article-text-p' }, blog.whyChooseClove.doctorsAndTech),

            e('h4', { style: { fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-teal-dark)' } }, 'Patient Care'),
            e('p', { className: 'article-text-p' }, blog.whyChooseClove.patientCare),

            e('h4', { style: { fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--text-dark)' } }, 'Trust Factors:'),
            e('div', { className: 'trust-factors-grid' },
              e('div', { className: 'trust-factor-card' },
                e('h3', null, '730+'),
                e('p', null, 'Clinics Across India')
              ),
              e('div', { className: 'trust-factor-card' },
                e('h3', null, '1,700+'),
                e('p', null, 'Expert Dentists')
              ),
              e('div', { className: 'trust-factor-card' },
                e('h3', null, '30 Lakh+'),
                e('p', null, 'Happy Patients Served')
              ),
              e('div', { className: 'trust-factor-card' },
                e('h3', null, '100%'),
                e('p', null, 'Painless RCT, Implants & Braces')
              )
            ),

            e('div', { className: 'article-callout-box' },
              e('i', { className: 'fas fa-hand-holding-medical' }),
              e('div', { className: 'article-callout-content' },
                e('strong', null, 'Why it matters'),
                e('p', null, blog.whyChooseClove.whyItMatters)
              )
            ),

            e('div', { style: { textAlign: 'center', margin: '2rem 0', padding: '1rem', background: '#F0FDFA', borderRadius: 'var(--radius-md)' } },
              e('h3', { style: { color: 'var(--primary-teal)', fontSize: '1.4rem', fontWeight: '700' } },
                '“' + blog.whyChooseClove.tagline + '”'
              )
            )
          ),

          /* 8. STEP-BY-STEP: HOW TO BOOK A DENTAL CONSULTATION */
          e('section', { id: 'how-to-book', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Step-by-Step: How to Book a Dental Consultation'),
            e('p', { className: 'article-text-p' }, 'Booking a dental consultation is simple. Here is a quick guide:'),

            e('div', { className: 'consultation-steps-grid' },
              (blog.howToBook || []).map((st) =>
                e('div', { key: st.step, className: 'booking-step-card' },
                  e('div', { className: 'booking-step-number' }, st.step),
                  e('h4', null, st.title),
                  e('p', null, st.desc)
                )
              )
            ),

            e('div', { style: { textAlign: 'center', marginTop: '1.5rem' } },
              e('button', {
                className: 'btn btn-primary',
                onClick: () => openBooking()
              }, e('i', { className: 'fas fa-calendar-check' }), ' Book an Online Consultation Now')
            )
          ),

          /* 9. DENTAL CARE TIPS */
          e('section', { id: 'tips', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Dental Care Tips'),
            e('p', { className: 'article-text-p', style: { fontWeight: '600', color: 'var(--primary-teal)' } }, blog.dentalCareTips.subtitle),

            e('div', { className: 'habits-grid' },
              (blog.dentalCareTips.tips || []).map((tip) =>
                e('div', { key: tip.number, className: 'habit-card' },
                  e('div', { className: 'habit-card-icon' },
                    e('i', { className: `fas ${tip.icon}` })
                  ),
                  e('h4', null, `${tip.number}. ${tip.title}`),
                  e('p', null, tip.detail)
                )
              )
            ),

            e('div', { className: 'article-callout-box' },
              e('i', { className: 'fas fa-shield-virus' }),
              e('div', { className: 'article-callout-content' },
                e('strong', null, 'Key Point'),
                e('p', null, blog.dentalCareTips.keyPoint)
              )
            )
          ),

          /* 10. WHEN SHOULD YOU VISIT A DENTIST? */
          e('section', { id: 'warning-signs', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'When Should You Visit a Dentist?'),
            e('p', { className: 'article-text-p' }, blog.whenToVisit.intro),

            e('div', { className: 'warning-signs-card' },
              e('h4', null,
                e('i', { className: 'fas fa-triangle-exclamation' }),
                ' Don’t Ignore These Signs'
              ),
              e('div', { className: 'warning-signs-grid' },
                (blog.whenToVisit.signs || []).map((sign, idx) =>
                  e('div', { key: idx, className: 'warning-sign-item' },
                    e('i', { className: 'fas fa-circle-exclamation' }),
                    e('span', null, sign)
                  )
                )
              )
            )
          ),

          /* 11. FREQUENTLY ASKED QUESTIONS */
          e('section', { id: 'faqs', className: 'article-content-block' },
            e('h2', { className: 'article-section-title' }, 'Frequently Asked Questions'),
            e('p', { className: 'article-text-p' }, 'Get answers to common queries regarding routine dental visits, root canal treatments, teeth cleaning, implants, and orthodontic care.'),

            e('div', { className: 'article-faq-container' },
              (blog.faqs || []).map((faq, idx) =>
                e('div', {
                  key: idx,
                  className: `article-faq-item ${activeFaq === idx ? 'active' : ''}`
                },
                  e('button', {
                    className: 'article-faq-question',
                    onClick: () => setActiveFaq(activeFaq === idx ? null : idx)
                  },
                    e('span', null, faq.question),
                    e('div', { className: 'article-faq-icon' },
                      e('i', { className: 'fas fa-chevron-down' })
                    )
                  ),
                  activeFaq === idx && e('div', { className: 'article-faq-answer' },
                    e('p', null, faq.answer)
                  )
                )
              )
            )
          ),

          /* 12. SEO KEYWORDS OVERVIEW */
          e('section', { id: 'seo-keywords', className: 'article-content-block' },
            e('h3', { style: { fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--text-dark)' } }, 'SEO Keywords & Coverage'),
            e('p', { className: 'article-text-p' }, 'These keywords are naturally integrated throughout the article, headings, introduction, body, and call-to-action sections:'),

            e('div', { className: 'benefits-table-wrapper', style: { margin: '1rem 0' } },
              e('table', { className: 'benefits-table' },
                e('thead', null,
                  e('tr', null,
                    e('th', { style: { width: '140px' } }, 'Type'),
                    e('th', null, 'Keywords')
                  )
                ),
                e('tbody', null,
                  e('tr', null,
                    e('td', null, e('strong', null, 'Primary')),
                    e('td', null, (blog.seoKeywords.primary || []).join(', '))
                  ),
                  e('tr', null,
                    e('td', null, e('strong', null, 'Secondary')),
                    e('td', null, (blog.seoKeywords.secondary || []).join(', '))
                  )
                )
              )
            )
          ),

          /* 13. PRIMARY CALL TO ACTION BANNER (MATCHING PAGE 8 OF PDF) */
          e('section', { id: 'cta', className: 'article-cta-banner' },
            e('span', { className: 'article-cta-badge' }, e('i', { className: 'fas fa-calendar-check' }), ' Priority Booking'),
            e('h3', null, 'Take the Next Step Towards a Healthier Smile'),
            e('p', null, blog.cta.title),
            e('button', {
              className: 'btn-cta-large',
              onClick: () => openBooking()
            }, e('i', { className: 'fas fa-calendar-alt' }), ' ', blog.cta.buttonText)
          ),

          /* 14. MARKETING REPORT SECTION (PAGES 9-10 OF PDF) */
          e('section', { id: 'marketing-report', className: 'marketing-report-accordion' },
            e('button', {
              className: 'marketing-report-toggle-btn',
              onClick: () => setMarketingOpen(!marketingOpen)
            },
              e('h3', null,
                e('i', { className: 'fas fa-chart-line badge-icon' }),
                ' Marketing Report Section (Competitor Analysis, Content Strategy & KPIs)'
              ),
              e('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)', fontWeight: '700', fontSize: '0.9rem' } },
                e('span', null, marketingOpen ? 'Collapse Report' : 'Expand Strategy Report'),
                e('i', { className: `fas fa-chevron-${marketingOpen ? 'up' : 'down'}` })
              )
            ),

            marketingOpen && e('div', { className: 'marketing-report-body' },
              // Competitor Analysis
              e('div', { className: 'marketing-section-box' },
                e('h4', null, e('i', { className: 'fas fa-magnifying-glass-chart' }), ' Competitor Analysis'),
                e('p', { className: 'article-text-p' }, blog.marketingReport.competitorAnalysis.intro),
                e('ul', { style: { paddingLeft: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-muted)' } },
                  (blog.marketingReport.competitorAnalysis.types || []).map((t, idx) =>
                    e('li', { key: idx, style: { marginBottom: '0.4rem' } },
                      e('strong', { color: 'var(--text-dark)' }, t.type, ': '), t.desc
                    )
                  )
                ),

                e('div', { className: 'benefits-table-wrapper' },
                  e('table', { className: 'competitor-table' },
                    e('thead', null,
                      e('tr', null,
                        e('th', null, 'Factor'),
                        e('th', null, 'Clove Dental'),
                        e('th', null, 'Competitors')
                      )
                    ),
                    e('tbody', null,
                      (blog.marketingReport.competitorAnalysis.comparisonTable || []).map((r, idx) =>
                        e('tr', { key: idx },
                          e('td', null, e('strong', null, r.factor)),
                          e('td', null, r.clove),
                          e('td', null, r.competitors)
                        )
                      )
                    )
                  )
                ),

                e('div', { style: { padding: '0.75rem 1rem', background: '#FFFBEB', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #F59E0B', fontSize: '0.85rem', color: '#92400E' } },
                  e('strong', null, 'Note: '), blog.marketingReport.competitorAnalysis.note
                )
              ),

              // Content Strategy & Google Business Profile
              e('div', { className: 'marketing-section-box' },
                e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' } },
                  e('div', null,
                    e('h4', null, e('i', { className: 'fas fa-pen-nib' }), ' Content Strategy'),
                    e('div', { className: 'strategy-pills-list' },
                      (blog.marketingReport.contentStrategy || []).map((cs, idx) =>
                        e('span', { key: idx, className: 'strategy-pill' }, e('i', { className: 'fas fa-check' }), ' ', cs)
                      )
                    )
                  ),
                  e('div', null,
                    e('h4', null, e('i', { className: 'fab fa-google' }), ' Google Business Profile Strategy'),
                    e('div', { className: 'strategy-pills-list' },
                      (blog.marketingReport.googleBusinessProfileStrategy || []).map((gbp, idx) =>
                        e('span', { key: idx, className: 'strategy-pill' }, e('i', { className: 'fas fa-map-pin' }), ' ', gbp)
                      )
                    )
                  )
                )
              ),

              // Social Media Plan & KPIs
              e('div', { className: 'marketing-section-box' },
                e('h4', null, e('i', { className: 'fas fa-share-nodes' }), ' Social Media Plan'),
                e('div', { className: 'benefits-table-wrapper' },
                  e('table', { className: 'competitor-table' },
                    e('thead', null,
                      e('tr', null,
                        e('th', null, 'Platform'),
                        e('th', null, 'Content Focus')
                      )
                    ),
                    e('tbody', null,
                      (blog.marketingReport.socialMediaPlan || []).map((sm, idx) =>
                        e('tr', { key: idx },
                          e('td', null, e('strong', null, sm.platform)),
                          e('td', null, sm.content)
                        )
                      )
                    )
                  )
                )
              ),

              e('div', { className: 'marketing-section-box' },
                e('h4', null, e('i', { className: 'fas fa-bullseye' }), ' Target KPIs'),
                e('div', { className: 'strategy-pills-list' },
                  (blog.marketingReport.kpis || []).map((kpi, idx) =>
                    e('span', { key: idx, className: 'strategy-pill', style: { background: 'var(--primary-teal-light)', borderColor: 'var(--primary-teal-border)', color: 'var(--primary-teal-dark)' } },
                      e('i', { className: 'fas fa-arrow-trend-up' }), ' ', kpi
                    )
                  )
                )
              )
            )
          ),

          /* 15. ARTICLE FOOTER NAVIGATION */
          e('div', { className: 'article-navigation-footer' },
            e('button', {
              className: 'btn btn-outline',
              onClick: () => navigateToPage('blog')
            }, e('i', { className: 'fas fa-arrow-left' }), ' Back to All Articles'),

            e('div', { style: { display: 'flex', gap: '0.75rem', alignItems: 'center' } },
              e('span', { style: { fontSize: '0.88rem', color: 'var(--text-muted)' } }, 'Share this guide:'),
              e('button', { className: 'share-btn', onClick: handleCopyLink, title: 'Copy Link' }, e('i', { className: copiedLink ? 'fas fa-check' : 'fas fa-link' })),
              e('a', { className: 'share-btn', title: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`, target: '_blank', rel: 'noreferrer' }, e('i', { className: 'fab fa-whatsapp' }))
            )
          )
        )
      )
    )
  );
}

/* 9. AI CHATBOT COMPONENT */
function AIChatbot({ openBooking, setActivePage, viewArticle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am the Clove Dental AI Assistant. I can help you find verified information about our doctors, treatments, clinic locations, timings, and appointment booking.'
    }
  ]);

  const handleSend = (userText) => {
    const textToProcess = userText || input;
    if (!textToProcess.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: textToProcess }];
    setMessages(newMessages);
    if (!userText) setInput('');

    setTimeout(() => {
      const reply = generateVerifiedResponse(textToProcess);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 300);
  };

  const generateVerifiedResponse = (query) => {
    const q = query.toLowerCase();
    const data = window.CLOVE_DATA;

    if (q.includes('blog') || q.includes('guide') || q.includes('pranathi') || q.includes('dental care guide') || q.includes('tips') || q.includes('habits')) {
      return "You can explore our comprehensive 'Complete Dental Care Guide: Treatments, Prevention & Healthy Smile Tips' in our new Blog section! It covers preventive care, root canal treatments, dental implants, teeth cleaning, braces, dental care habits, and FAQs.";
    }

    if (q.includes('best dentist') || q.includes('who is the best')) {
      return "I can help you find a Clove Dental dentist based on specialization and location. Which city or treatment are you looking for?";
    }

    if (q.includes('orthodontist') && q.includes('hyderabad')) {
      return "Yes, Clove Dental provides orthodontic care in Hyderabad. I can help you find a clinic or available orthodontist. Which area of Hyderabad are you looking for?";
    }

    if (q.includes('dr ') || q.includes('dr.') || q.includes('doctor')) {
      const match = data.doctors.find(d => q.includes(d.name.toLowerCase().replace('dr.', '').trim()));
      if (match) {
        return `${match.name} is a verified ${match.specialization} at Clove Dental in ${match.area}, ${match.location} with ${match.experience} years of experience. Qualification: ${match.qualification}. Available: ${match.availableDays}.`;
      } else if (q.includes('dr xyz') || (q.includes('dr') && !data.doctors.some(d => q.includes(d.name.toLowerCase().split(' ')[1])))) {
        return "I’m sorry, I don’t have verified information about that doctor in the Clove Dental database. Please check the official Clove Dental Doctors page for the latest information.";
      }
    }

    if (q.includes('cost') || q.includes('price') || q.includes('fee')) {
      return "Treatment costs can vary depending on the treatment, clinic and individual case. I can show you the verified price information available for the treatment you're asking about.";
    }

    if (q.includes('address') || q.includes('clinic location') || q.includes('near me')) {
      if (q.includes('hyderabad')) {
        return "Verified Clove Dental clinics in Hyderabad include: Jubilee Hills (Road 36), Banjara Hills (Road 12), Gachibowli (Telecom Nagar), Madhapur (Cyber Towers), Hitec City, Kukatpally, Secunderabad, and Kondapur. Opening hours: 10:00 AM – 8:00 PM.";
      }
      return "Sure. Please tell me the city or area, and I'll provide the verified clinic location available in the Clove Dental database.";
    }

    if (q.includes('timing') || q.includes('hours') || q.includes('open')) {
      return "Official clinic timings across Clove Dental are Monday–Sunday: 10:00 AM – 8:00 PM. Headquarter timings are Monday–Sunday: 9:00 AM – 6:00 PM.";
    }

    if (q.includes('disease') || q.includes('what do i have') || q.includes('diagnose') || q.includes('symptom')) {
      return "I can't diagnose a dental condition through chat. I can explain common symptoms and treatments, but a qualified dentist needs to examine you for an accurate diagnosis.";
    }

    if (q.includes('emergency') || q.includes('severe pain') || q.includes('bleeding')) {
      return "If you are experiencing a severe dental emergency, please contact the nearest Clove Dental clinic immediately at +91 9667352322 (North) or +91 9393552322 (South), or visit an emergency medical service.";
    }

    const trtMatch = data.treatments.find(t => q.includes(t.title.toLowerCase()));
    if (trtMatch) {
      return `${trtMatch.title}: ${trtMatch.shortDesc} Key benefits include: ${trtMatch.benefits.join(', ')}.`;
    }

    if (q.includes('contact') || q.includes('phone') || q.includes('head office')) {
      return `Clove Dental Head Office: Third Floor, Eldeco Centre, Block A, MRTS Station, Malviya Nagar, New Delhi 110017. Helpline North: +91 9667352322, South: +91 9393552322. Email: dentist@clovedental.in`;
    }

    return "I’m sorry, I don’t have verified information about that right now. Please contact Clove Dental directly or use the official clinic locator for the latest information.";
  };

  return e(React.Fragment, null,
    e('button', { className: 'chatbot-toggle-btn', onClick: () => setIsOpen(!isOpen) },
      e('i', { className: `fas ${isOpen ? 'fa-times' : 'fa-headset'}` }),
      e('span', { className: 'chatbot-badge' }, 'AI')
    ),

    isOpen && e('div', { className: 'chatbot-window' },
      e('div', { className: 'chatbot-header' },
        e('div', { className: 'bot-info' },
          e('div', { className: 'bot-avatar' }, e('i', { className: 'fas fa-robot' })),
          e('div', { className: 'bot-title' },
            e('h4', null, 'Clove Dental AI Assistant'),
            e('span', null, e('span', { className: 'status-dot' }), ' Online & Verified')
          )
        ),
        e('button', { style: { background: 'none', color: '#ffffff', fontSize: '1.2rem' }, onClick: () => setIsOpen(false) },
          e('i', { className: 'fas fa-minus' })
        )
      ),

      e('div', { className: 'chatbot-messages' },
        messages.map((m, idx) =>
          e('div', { key: idx, className: `chat-bubble ${m.sender}` }, m.text)
        )
      ),

      e('div', { className: 'suggested-prompts', style: { padding: '0.5rem 0.85rem' } },
        e('span', { className: 'prompt-chip', onClick: () => { setIsOpen(false); viewArticle ? viewArticle('complete-dental-care-guide') : setActivePage('blog'); } }, 'Complete Dental Care Guide'),
        e('span', { className: 'prompt-chip', onClick: () => handleSend('Tell me about Root Canal Treatment') }, 'Root Canal Treatment'),
        e('span', { className: 'prompt-chip', onClick: () => handleSend('What are your clinic timings?') }, 'Clinic Timings?')
      ),

      e('div', { className: 'chatbot-input-area' },
        e('input', {
          type: 'text',
          className: 'chat-input',
          placeholder: 'Ask about doctors, treatments...',
          value: input,
          onChange: (ev) => setInput(ev.target.value),
          onKeyDown: (ev) => ev.key === 'Enter' && handleSend()
        }),
        e('button', { className: 'chat-send-btn', onClick: () => handleSend() },
          e('i', { className: 'fas fa-paper-plane' })
        )
      )
    )
  );
}

/* MODALS */
function DoctorModal({ doctor, onClose, openBooking }) {
  return e('div', { className: 'modal-overlay', onClick: onClose },
    e('div', { className: 'modal-content', onClick: (ev) => ev.stopPropagation() },
      e('button', { className: 'modal-close-btn', onClick: onClose }, e('i', { className: 'fas fa-times' })),
      e('div', { style: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' } },
        e('img', { src: doctor.image, alt: doctor.name, style: { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' } }),
        e('div', null,
          e('h2', { style: { fontSize: '1.5rem' } }, doctor.name),
          e('p', { style: { color: 'var(--primary-teal)', fontWeight: '600' } }, doctor.qualification),
          e('p', { style: { fontSize: '0.9rem', color: 'var(--text-muted)' } }, `${doctor.specialization} • ${doctor.experience} Yrs Experience`),
          e('p', { style: { fontSize: '0.9rem', marginTop: '0.25rem' } }, e('i', { className: 'fas fa-location-dot', style: { color: 'var(--primary-teal)' } }), ` ${doctor.area}, ${doctor.location}`)
        )
      ),

      e('h4', { style: { marginBottom: '0.5rem' } }, 'Doctor Biography'),
      e('p', { style: { marginBottom: '1.25rem', lineHeight: '1.6' } }, doctor.bio),

      e('h4', { style: { marginBottom: '0.5rem' } }, 'Key Expertise Areas'),
      e('div', { className: 'doctor-expertise-chips', style: { marginBottom: '1.5rem' } },
        doctor.expertise.map((exp, i) => e('span', { key: i, className: 'expertise-chip' }, exp))
      ),

      e('button', { className: 'btn btn-primary', style: { width: '100%' }, onClick: () => { onClose(); openBooking({ doctor: doctor.name, city: doctor.location }); } },
        `Book Appointment with ${doctor.name}`
      )
    )
  );
}

function TreatmentModal({ treatment, onClose, openBooking }) {
  return e('div', { className: 'modal-overlay', onClick: onClose },
    e('div', { className: 'modal-content', onClick: (ev) => ev.stopPropagation() },
      e('button', { className: 'modal-close-btn', onClick: onClose }, e('i', { className: 'fas fa-times' })),
      e('img', { src: treatment.image, alt: treatment.title, style: { width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' } }),
      e('span', { className: 'treatment-tag' }, treatment.category),
      e('h2', { style: { fontSize: '1.75rem', margin: '0.5rem 0' } }, treatment.title),
      e('p', { style: { fontSize: '1.05rem', marginBottom: '1.25rem' } }, treatment.shortDesc),

      e('div', { className: 'who-needs-box', style: { marginBottom: '1.25rem' } },
        e('strong', null, 'Who may need this treatment: '), treatment.whoNeedsIt
      ),

      e('h4', { style: { marginBottom: '0.5rem' } }, 'Key Benefits'),
      e('ul', { className: 'service-features-list', style: { marginBottom: '1.5rem' } },
        treatment.benefits.map((b, i) =>
          e('li', { key: i, className: 'service-feature-item' },
            e('i', { className: 'fas fa-check-circle', style: { color: '#10B981' } }), ' ', b
          )
        )
      ),

      e('div', { style: { padding: '0.75rem 1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' } },
        e('em', null, 'Disclaimer: Information provided is for general educational awareness. Please schedule a clinical examination for diagnosis.')
      ),

      e('button', { className: 'btn btn-primary', style: { width: '100%' }, onClick: () => { onClose(); openBooking({ treatment: treatment.title }); } },
        `Book Appointment for ${treatment.title}`
      )
    )
  );
}

function GalleryLightbox({ item, onClose }) {
  return e('div', { className: 'modal-overlay', onClick: onClose },
    e('div', { className: 'modal-content lightbox-modal', onClick: (ev) => ev.stopPropagation(), style: { textAlign: 'center', background: '#0F172A', color: '#ffffff' } },
      e('button', { className: 'modal-close-btn', onClick: onClose, style: { background: '#ffffff', color: '#000' } }, e('i', { className: 'fas fa-times' })),
      e('img', { src: item.image, alt: item.title }),
      e('h3', { style: { color: '#ffffff', marginTop: '1rem' } }, item.title),
      e('p', { style: { color: 'var(--text-light)', marginTop: '0.35rem' } }, item.description)
    )
  );
}

function AppointmentModal({ preselect, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    city: preselect.city || 'Hyderabad',
    clinic: preselect.clinic || '',
    doctor: preselect.doctor || '',
    treatment: preselect.treatment || '',
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setConfirmed(true);
  };

  return e('div', { className: 'modal-overlay', onClick: onClose },
    e('div', { className: 'modal-content', onClick: (ev) => ev.stopPropagation() },
      e('button', { className: 'modal-close-btn', onClick: onClose }, e('i', { className: 'fas fa-times' })),

      confirmed ?
        e('div', { style: { textAlign: 'center', padding: '2rem 0' } },
          e('i', { className: 'fas fa-calendar-check', style: { fontSize: '3.5rem', color: '#10B981', marginBottom: '1rem' } }),
          e('h2', null, 'Appointment Requested Successfully!'),
          e('p', { style: { margin: '1rem 0' } }, 'Reference Code: ', e('strong', null, `CLOVE-2026-${(Math.random()*90000 + 10000).toFixed(0)}`)),
          e('p', null, 'Our patient care team will call ', e('strong', null, formData.phone), ' to confirm your slot time.'),
          e('button', { className: 'btn btn-primary', style: { marginTop: '1.5rem' }, onClick: onClose }, 'Done')
        ) :
        e('form', { onSubmit: handleSubmit },
          e('div', { className: 'section-title-wrapper', style: { marginBottom: '1.5rem', textAlign: 'left' } },
            e('span', { className: 'section-subtitle' }, 'Instant Booking'),
            e('h2', { style: { fontSize: '1.75rem' } }, 'Book Your Dental Visit')
          ),

          e('div', { className: 'form-group' },
            e('label', null, 'Select City'),
            e('select', { className: 'form-control', value: formData.city, onChange: (ev) => setFormData({ ...formData, city: ev.target.value }) },
              e('option', { value: 'Hyderabad' }, 'Hyderabad'),
              e('option', { value: 'Delhi' }, 'Delhi'),
              e('option', { value: 'Bengaluru' }, 'Bengaluru'),
              e('option', { value: 'Mumbai' }, 'Mumbai'),
              e('option', { value: 'Chennai' }, 'Chennai')
            )
          ),

          e('div', { className: 'form-group' },
            e('label', null, 'Doctor / Specialty (Optional)'),
            e('input', { type: 'text', className: 'form-control', placeholder: 'e.g. Dr. Abhiruchi Gupta or Root Canal', value: formData.doctor || formData.treatment, onChange: (ev) => setFormData({ ...formData, doctor: ev.target.value }) })
          ),

          e('div', { className: 'form-group' },
            e('label', null, 'Preferred Date'),
            e('input', { type: 'date', required: true, className: 'form-control', value: formData.date, onChange: (ev) => setFormData({ ...formData, date: ev.target.value }) })
          ),

          e('div', { className: 'form-group' },
            e('label', null, 'Patient Name *'),
            e('input', { type: 'text', required: true, className: 'form-control', placeholder: 'Full Name', value: formData.name, onChange: (ev) => setFormData({ ...formData, name: ev.target.value }) })
          ),

          e('div', { className: 'form-group' },
            e('label', null, 'Mobile Number *'),
            e('input', { type: 'tel', required: true, className: 'form-control', placeholder: '10-digit mobile number', value: formData.phone, onChange: (ev) => setFormData({ ...formData, phone: ev.target.value }) })
          ),

          e('button', { type: 'submit', className: 'btn btn-primary', style: { width: '100%', marginTop: '1rem' } }, 'Confirm Appointment Booking')
        )
    )
  );
}

/* FOOTER */
function Footer({ setActivePage, openBooking, viewArticle, navigateToPage }) {
  const info = window.CLOVE_DATA.contactInfo;

  return e('footer', { className: 'footer' },
    e('div', { className: 'container' },
      e('div', { className: 'footer-grid' },
        e('div', { className: 'footer-brand' },
          e('div', { className: 'logo-brand', style: { color: '#ffffff', marginBottom: '1rem' } },
            e('div', { className: 'logo-icon' }, e('i', { className: 'fas fa-tooth' })),
            e('div', { className: 'brand-text' }, 'clove', e('span', { style: { color: 'var(--accent-orange)' } }, 'dental'))
          ),
          e('p', null, 'India\'s largest network of tech-enabled, ethical dental clinics. Delivering gentle care across 730+ clinics.'),
          e('div', { className: 'social-links' },
            e('a', { href: '#', 'aria-label': 'Facebook' }, e('i', { className: 'fab fa-facebook-f' })),
            e('a', { href: '#', 'aria-label': 'Instagram' }, e('i', { className: 'fab fa-instagram' })),
            e('a', { href: '#', 'aria-label': 'LinkedIn' }, e('i', { className: 'fab fa-linkedin-in' })),
            e('a', { href: '#', 'aria-label': 'Twitter' }, e('i', { className: 'fab fa-x-twitter' }))
          )
        ),

        e('div', { className: 'footer-column' },
          e('h4', null, 'Quick Navigation'),
          e('ul', { className: 'footer-links' },
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('home'); } }, 'Home')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('about'); } }, 'About Us')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('doctors'); } }, 'Our Doctors')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('services'); } }, 'Services')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('treatments'); } }, 'Treatments')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); navigateToPage ? navigateToPage('blog') : setActivePage('blog'); } }, 'Blog & Dental Guides')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('gallery'); } }, 'Gallery')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('testimonials'); } }, 'Testimonials')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('contact'); } }, 'Contact & Clinics'))
          )
        ),

        e('div', { className: 'footer-column' },
          e('h4', null, 'Patient Care'),
          e('ul', { className: 'footer-links' },
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); openBooking(); } }, 'Book Appointment')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('contact'); } }, 'Find Clinic Near Me')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); viewArticle ? viewArticle('complete-dental-care-guide') : setActivePage('blog-article'); } }, 'Complete Dental Care Guide')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('treatments'); } }, 'Root Canal Treatment')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('treatments'); } }, 'Dental Implants')),
            e('li', null, e('a', { href: '#', onClick: (ev) => { ev.preventDefault(); setActivePage('treatments'); } }, 'Clear Aligners'))
          )
        ),

        e('div', { className: 'footer-column' },
          e('h4', null, 'Headquarters'),
          e('ul', { className: 'footer-contact-list' },
            e('li', null, e('i', { className: 'fas fa-map-marker-alt' }), ' ', info.headOffice),
            e('li', null, e('i', { className: 'fas fa-phone' }), ' North: ', info.helplineNorth),
            e('li', null, e('i', { className: 'fas fa-phone' }), ' South: ', info.helplineSouth),
            e('li', null, e('i', { className: 'fas fa-envelope' }), ' ', info.generalEmail)
          )
        )
      ),

      e('div', { className: 'footer-bottom' },
        e('p', null, '© 2026 Clove Dental (Star Dental Centre Private Limited). All rights reserved.'),
        e('div', { style: { display: 'flex', gap: '1.5rem' } },
          e('a', { href: '#', style: { color: 'var(--text-light)' } }, 'Privacy Policy'),
          e('a', { href: '#', style: { color: 'var(--text-light)' } }, 'Terms & Conditions')
        )
      )
    )
  );
}

// Mount React App safely regardless of document readyState
function mountApp() {
  const rootElement = document.getElementById('root');
  if (rootElement && window.ReactDOM && !window.__CLOVE_MOUNTED__) {
    window.__CLOVE_MOUNTED__ = true;
    const root = ReactDOM.createRoot(rootElement);
    root.render(e(App));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
