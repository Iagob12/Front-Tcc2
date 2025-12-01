import React from "react";
import Header from "../../components/Header";
import SectionBlog from "../../components/PageBlog/section-blog"
import Footer from "../../components/Footer";
import AppPromoBanner from "../../components/AppPromoBanner";

const Blog = () => {
    return(
        <>
        <Header/>
        <SectionBlog/>
        <Footer/>
        <AppPromoBanner />
        </>
    )
}
export default Blog;