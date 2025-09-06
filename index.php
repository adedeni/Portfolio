<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="adedeni" content="" />
    <title>Adedeni's Portfolio</title>
    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="assets/favicon.png" />
    <!-- Bootstrap Icons-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
    <!-- Google fonts-->
    <link href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic" rel="stylesheet" type="text/css" />
    <!-- SimpleLightbox plugin CSS-->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/SimpleLightbox/2.1.0/simpleLightbox.min.css" rel="stylesheet" />
    <!-- Core theme CSS (includes Bootstrap)-->
    <link href="css/styles.css" rel="stylesheet" />
    <style>
        :root {
            --primary-color: #6366f1;
            --secondary-color: #8b5cf6;
            --accent-color: #06b6d4;
            --dark-bg: #0f172a;
            --light-bg: #f8fafc;
            --text-dark: #1e293b;
            --text-light: #64748b;
            --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        * {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
        }

        /* Modern Hero Section */
        .masthead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            position: relative;
            overflow: hidden;
        }

        .masthead::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="300" fill="url(%23a)"/><circle cx="800" cy="300" r="200" fill="url(%23a)"/><circle cx="400" cy="700" r="250" fill="url(%23a)"/></svg>');
            opacity: 0.3;
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(45deg, #ffffff, #e2e8f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1.5rem;
            animation: fadeInUp 1s ease-out;
        }

        .hero-subtitle {
            font-size: 1.5rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
            animation: fadeInUp 1s ease-out 0.2s both;
        }

        .social-links {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            margin-top: 2rem;
            animation: fadeInUp 1s ease-out 0.4s both;
        }

        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .social-link:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .social-link svg {
            width: 30px;
            height: 30px;
            fill: white;
        }

        /* Modern Navigation */
        .navbar { 
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.95) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }

        .navbar-brand {
            font-weight: 700;
            font-size: 1.5rem;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nav-link {
            font-weight: 500;
            color: var(--text-dark) !important;
            position: relative;
            transition: all 0.3s ease;
        }

        .nav-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            width: 0;
            height: 2px;
            background: var(--gradient-primary);
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
            width: 100%;
        }

        /* Modern Services Section */
        .service-card {
            background: white;
            border-radius: 20px;
            padding: 2.5rem 2rem;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
        }

        .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient-primary);
        }

        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .icon-box {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            border-radius: 20px;
            margin-bottom: 1.5rem;
            transition: all 0.3s ease;
        }

        .service-card:hover .icon-box {
            background: var(--gradient-primary);
            transform: scale(1.1);
        }

        .icon-box i {
            font-size: 2.5rem;
            color: var(--primary-color);
            transition: all 0.3s ease;
        }

        .service-card:hover .icon-box i {
            color: white;
        }

        .icon-box img {
            max-height: 50px;
            width: auto;
            transition: all 0.3s ease;
        }

        .service-card:hover .icon-box img {
            filter: brightness(0) invert(1);
        }

        /* Modern Portfolio Section */
        .portfolio-box {
            position: relative;
            overflow: hidden;
            border-radius: 20px;
            transition: all 0.3s ease;
        }

        .portfolio-box:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .portfolio-box-caption {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9));
            backdrop-filter: blur(10px);
            border-radius: 20px;
        }

        /* Modern Contact Section */
        .contact-form {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-control {
            border: 2px solid #e2e8f0;
            border-radius: 15px;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
        }

        .btn-primary {
            background: var(--gradient-primary);
            border: none;
            border-radius: 15px;
            padding: 1rem 2rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
        }

        /* Contact Info Cards */
        .contact-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .contact-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .contact-card img {
            width: 50px;
            height: 50px;
            margin-bottom: 1rem;
        }

        .contact-card a {
            color: var(--text-dark);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .contact-card a:hover {
            color: var(--primary-color);
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in-up {
            animation: fadeInUp 0.8s ease-out;
        }

        /* Section Spacing */
        .page-section {
            padding: 5rem 0;
        }

        /* Dark Mode Toggle */
        .dark-mode-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .dark-mode-toggle:hover {
            transform: scale(1.1);
        }

        /* Dark Mode Styles */
        .dark-mode {
            background-color: var(--dark-bg);
            color: #e2e8f0;
        }

        .dark-mode .navbar {
            background: rgba(15, 23, 42, 0.95) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark-mode .nav-link {
            color: #e2e8f0 !important;
        }

        .dark-mode .service-card {
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark-mode .contact-form {
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark-mode .contact-card {
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark-mode .form-control {
            background: #334155;
            border: 2px solid #475569;
            color: #e2e8f0;
        }

        .dark-mode .form-control:focus {
            background: #334155;
            border-color: var(--primary-color);
            color: #e2e8f0;
        }

        .dark-mode .form-control::placeholder {
            color: #94a3b8;
        }

        .dark-mode .text-muted {
            color: #94a3b8 !important;
        }

        .dark-mode .contact-card a {
            color: #e2e8f0;
        }

        .dark-mode .contact-card a:hover {
            color: var(--primary-color);
        }

        .dark-mode .dark-mode-toggle {
            background: #1e293b;
            color: #e2e8f0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }

            .hero-subtitle {
                font-size: 1.2rem;
            }

            .social-links {
                gap: 1rem;
            }

            .social-link {
                width: 50px;
                height: 50px;
            }

            .social-link svg {
                width: 25px;
                height: 25px;
            }
        }
    </style>
</head>

<body id="page-top">
    <!-- Dark Mode Toggle -->
    <button class="dark-mode-toggle" id="darkModeToggle" title="Toggle Dark Mode">
        <i class="bi bi-moon-fill"></i>
    </button>

    <!-- Navigation-->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
        <div class="container px-4 px-lg-5">
            <a class="navbar-brand" href="#page-top">adedeni's Portfolio</a>
            <button class="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ms-auto my-2 my-lg-0">
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
                    <li class="nav-item"><a class="nav-link" href="#portfolio">Portfolio</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- Masthead-->
    <header class="masthead">
        <div class="container px-4 px-lg-5 h-100">
            <div class="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
                <div class="col-lg-10 hero-content">
                    <h1 class="hero-title">
                        Hey, I'm <span class="text-gradient">Olayode Adeshina</span><br>
                        Most people call me <span class="text-gradient">'adedeni'</span>
                    </h1>
                    <p class="hero-subtitle">Full-Stack Web & Mobile App Developer</p>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/in/adeshina-olayode/" class="social-link" target="_blank" title="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a href="https://github.com/adedeni" class="social-link" target="_blank" title="GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a href="https://wa.me/09036176161" class="social-link" target="_blank" title="WhatsApp">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                            </svg>
                        </a>
                        <a href="mailto:adeshinaolayodemubaraq@gmail.com" class="social-link" target="_blank" title="Email">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- About-->
    <section class="page-section bg-primary" id="about">
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-8 text-center">
                    <h2 class="text-white mt-0">I've got what you need!</h2>
                    <hr class="divider divider-light" />
                    <p class="text-white-75 mb-4">Come let's help you scale up your business and provide the most efficient web solutions, that brings your idea to life! I am also buzzing to join a productive team in a junior roles.</p>
                    <a class="btn btn-light btn-xl" href="#services">Get Started!</a>
                </div>
            </div>
        </div>
    </section>
    <!-- Services-->
    <section class="page-section" id="services">
        <div class="container px-4 px-lg-5">
            <div class="row justify-content-center mb-5">
                <div class="col-lg-8 text-center">
                    <h2 class="display-4 fw-bold mb-4">At Your Service</h2>
                    <p class="lead text-muted">I provide comprehensive web development solutions to bring your ideas to life</p>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="service-card h-100">
                        <div class="icon-box">
                            <i class="bi-laptop"></i>
                        </div>
                        <h3 class="h4 mb-3">Website Development/Design</h3>
                        <p class="text-muted mb-0">Creating fully responsive websites with exceptional UI/UX design that engage users and drive conversions.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="service-card h-100">
                        <div class="icon-box">
                            <i class="bi-globe"></i>
                        </div>
                        <h3 class="h4 mb-3">Web Hosting & Maintenance</h3>
                        <p class="text-muted mb-0">Complete hosting solutions including domain setup, SSL certificates, and ongoing backend maintenance with database management.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="service-card h-100">
                        <div class="icon-box">
                            <img src="data:image/png;base64,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" alt="source-code--v1">
                        </div>
                        <h3 class="h4 mb-3">Clean & Efficient Code</h3>
                        <p class="text-muted mb-0">Writing maintainable, scalable code that powers complex web applications with optimal performance and security.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Portfolio-->
    <div id="portfolio">
        <div class="container-fluid p-0">
            <div class="row g-0">
                <div class="col-lg-4 col-sm-6">
                    <a class="portfolio-box" href="assets/img/portfolio/fullsize/1.jpg" title="Project Name">
                        <img class="img-fluid" src="assets/img/portfolio/thumbnails/1.jpg" alt="..." />
                        <div class="portfolio-box-caption">
                            <div class="project-category text-white-50">Category</div>
                            <div class="project-name">Project Name</div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a class="portfolio-box" href="assets/img/portfolio/fullsize/2.jpg" title="Project Name">
                        <img class="img-fluid" src="assets/img/portfolio/thumbnails/2.jpg" alt="..." />
                        <div class="portfolio-box-caption">
                            <div class="project-category text-white-50">Category</div>
                            <div class="project-name">Project Name</div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a class="portfolio-box" href="assets/img/portfolio/fullsize/3.jpg" title="Project Name">
                        <img class="img-fluid" src="assets/img/portfolio/thumbnails/3.jpg" alt="..." />
                        <div class="portfolio-box-caption">
                            <div class="project-category text-white-50">Category</div>
                            <div class="project-name">Project Name</div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a class="portfolio-box" href="assets/img/portfolio/fullsize/4.jpg" title="Project Name">
                        <img class="img-fluid" src="assets/img/portfolio/thumbnails/4.jpg" alt="..." />
                        <div class="portfolio-box-caption">
                            <div class="project-category text-white-50">Category</div>
                            <div class="project-name">Project Name</div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a class="portfolio-box" href="assets/img/portfolio/fullsize/5.jpg" title="Project Name">
                        <img class="img-fluid" src="assets/img/portfolio/thumbnails/5.jpg" alt="..." />
                        <div class="portfolio-box-caption">
                            <div class="project-category text-white-50">Category</div>
                            <div class="project-name">Project Name</div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <a class="portfolio-box" href="assets/img/portfolio/fullsize/6.jpg" title="Project Name">
                        <img class="img-fluid" src="assets/img/portfolio/thumbnails/6.jpg" alt="..." />
                        <div class="portfolio-box-caption p-3">
                            <div class="project-category text-white-50">Category</div>
                            <div class="project-name">Project Name</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <!-- Call to action-->
    <section class="page-section bg-dark text-white">
        <div class="container px-4 px-lg-5 text-center">
            <h2 class="mb-4">Here is a Copy of My Resume for your Perusal</h2>
            <a class="btn btn-light btn-xl" href="assets\olayodeAdeshinaCv.pdf" download>Download</a>
        </div>
    </section>
    <!-- Contact-->
    <section class="page-section" id="contact">
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-8 col-xl-6 text-center">
                    <h2 class="mt-0">Get In Touch!</h2>
                    <hr class="divider" />
                    <p class="text-muted mb-5">Ready to start your next project with me or want to bring me on board on Project? Send us a messages and we will get back to you as soon as possible!</p>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5 justify-content-center mb-5">
                <div class="col-lg-8">
                    <div class="contact-form">
                        <form id="contactForm" method="POST" action="process_form.php">
                            <!-- Name input-->
                            <div class="form-floating mb-3">
                                <input class="form-control" id="name" name="name" type="text" placeholder="Enter your name..." required />
                                <label for="name">Name</label>
                                <div class="invalid-feedback">A name is required.</div>
                            </div>
                            <!-- Email address input-->
                            <!-- Combined Email or Phone input-->
                            <div class="form-floating mb-3">
                                <input class="form-control" id="contact" name="contact" type="text" placeholder="Enter email or phone number" required />
                                <label for="contact">Email or Phone number</label>
                            </div>
                            <!-- Message input-->
                            <div class="form-floating mb-3">
                                <textarea class="form-control" id="message" name="message" placeholder="Enter your message here..." style="height: 10rem" required></textarea>
                                <label for="message">Message</label>
                                <div class="invalid-feedback">A message is required.</div>
                            </div>
                            <!-- Submit Button-->
                            <div class="d-grid">
                                <button class="btn btn-primary btn-xl" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </section>
    <!-- Footer-->
    <footer class="bg-black py-5" style="background-color: black;">
        <div class="container px-4 px-lg-5">
            <div class="copyright text-center text-sm text-muted text-lg-start">
                © <script>
                    document.write(new Date().getFullYear())
                </script>,
                Copyright <i class="fa fa-heart"></i> by
                <a href="#">adedeni</a>
                All Rights Reserved.
            </div>
        </div>
    </footer>
    <!-- Bootstrap core JS-->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- SimpleLightbox plugin JS-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/SimpleLightbox/2.1.0/simpleLightbox.min.js"></script>
    <!-- Core theme JS-->
    <script src="js/scripts.js"></script>
    
    <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
    <script>
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;

        // Check for saved dark mode preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }

        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            darkModeToggle.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add active class to navigation links on scroll
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe all service cards and contact cards
        document.querySelectorAll('.service-card, .contact-card, .portfolio-box').forEach(el => {
            observer.observe(el);
        });

        document.getElementById("contactForm").addEventListener("submit", function(e) {
            e.preventDefault();

            const form = e.target;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';

            const formData = new FormData(form);

            fetch("process_form.php", {
                    method: "POST",
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert(data.message);
                        form.reset();
                    } else if (data.status === 'whatsapp') {
                        // 🚀 Redirect to WhatsApp without any popup
                        window.location.href = data.redirect;
                    } else {
                        alert(data.message || "Something went wrong.");
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("An error occurred. Please try again.");
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                });
        });
    </script>
</body>

</html>