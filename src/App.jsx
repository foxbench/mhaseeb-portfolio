import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import BlogList from "./components/BlogList";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import ThemeSwitcher from "./components/ThemeSwitcher";
import BlogPost from "./components/BlogPost";

function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <div className="section-line" />
        <Skills />
        <div className="section-line" />
        <Experience />
        <div className="section-line" />
        <Projects />
        <div className="section-line" />
        <Education />
        <div className="section-line" />
        <BlogList />
        <div className="section-line" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
        <ChatWidget />
        <ThemeSwitcher />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
