// Clove Dental Pure React 18 Application (Native JS without Babel CORS requirement)

const { useState, useEffect, createElement: e } = React;

function App() {
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modals & Active Selections
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPreselect, setBookingPreselect] = useState({});

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [activePage]);

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
          e('div', { className: 'logo-brand', onClick: () => setActivePage('home'), style: { cursor: 'pointer' } },
            e('div', { className: 'logo-icon' }, e('i', { className: 'fas fa-tooth' })),
            e('div', { className: 'brand-text' }, 'clove', e('span', null, 'dental'))
          ),

          e('ul', { className: `nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}` },
            navItems.map(item => 
              e('li', { key: item.id },
                e('button', {
                  className: `nav-link ${activePage === item.id ? 'active' : ''}`,
                  onClick: () => setActivePage(item.id)
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
      activePage === 'home' && e(HomePage, { setActivePage, openBooking, setSelectedTreatment }),
      activePage === 'about' && e(AboutPage, { openBooking }),
      activePage === 'doctors' && e(DoctorsPage, { setSelectedDoctor, openBooking }),
      activePage === 'services' && e(ServicesPage, { openBooking }),
      activePage === 'treatments' && e(TreatmentsPage, { setSelectedTreatment, openBooking }),
      activePage === 'gallery' && e(GalleryPage, { setSelectedGalleryItem }),
      activePage === 'testimonials' && e(TestimonialsPage, { openBooking }),
      activePage === 'contact' && e(ContactPage, { openBooking })
    ),

    // Floating Chatbot Widget
    e(AIChatbot, { openBooking, setActivePage }),

    // Footer
    e(Footer, { setActivePage, openBooking }),

    // Modals
    selectedDoctor && e(DoctorModal, { doctor: selectedDoctor, onClose: () => setSelectedDoctor(null), openBooking }),
    selectedTreatment && e(TreatmentModal, { treatment: selectedTreatment, onClose: () => setSelectedTreatment(null), openBooking }),
    selectedGalleryItem && e(GalleryLightbox, { item: selectedGalleryItem, onClose: () => setSelectedGalleryItem(null) }),
    bookingModalOpen && e(AppointmentModal, { preselect: bookingPreselect, onClose: () => setBookingModalOpen(false) })
  );
}

/* 1. HOME PAGE */
function HomePage({ setActivePage, openBooking, setSelectedTreatment }) {
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

/* 9. AI CHATBOT COMPONENT */
function AIChatbot({ openBooking, setActivePage }) {
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
        e('span', { className: 'prompt-chip', onClick: () => handleSend('Do you have an orthodontist in Hyderabad?') }, 'Orthodontist in Hyderabad?'),
        e('span', { className: 'prompt-chip', onClick: () => handleSend('What are your clinic timings?') }, 'Clinic Timings?'),
        e('span', { className: 'prompt-chip', onClick: () => handleSend('Tell me about Root Canal Treatment') }, 'Root Canal Treatment')
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
function Footer({ setActivePage, openBooking }) {
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

// Mount React App when window loads
window.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (rootElement && window.ReactDOM) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(e(App));
  }
});
