import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input"
import Footer from './Footer';
import supabase from './SupabaseClient';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error.message);
      return;
    }

    setBlogs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
    const interval = setInterval(fetchBlogs, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCreatedAt = (createdAt) => {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(createdAt).toLocaleString('en-US', options);
  };

  const HtmlRenderer = ({ html }) => {
    const parsedHtml = parse(html, {
      replace: (domNode) => {
        if (domNode.type === 'text') {
          // Remove leading and trailing whitespaces
          return domNode.data.trim();
        }
      },
    });

    return <>{parsedHtml}</>;
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(blogs.length / blogsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='container mx-auto bg-stone-100 h-max min-h-screen rounded-xl p-4 m-4'>
      <div className='flex items-center justify-center h-[30vh] gap-x-2'>
        <h1 className='text-[2rem] font-semibold px-2 py-0 border-[3px] border-black rounded-2xl inter-typeface'>Ivan's</h1>
        <h1 className='text-[2rem] font-semibold inter-typeface'>blog</h1>
      </div>
      <div className='flex items-center justify-center -space-x-[4rem]'>
        <motion.div
        className="h-40 w-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        >
          <img className='rotate-[12deg] rounded-[16px] aspect-square object-cover border-[8px] border-white shadow-xl' src='https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
        </motion.div>

        <motion.div
        className="h-40 w-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: .8,
          delay: 0.6,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        >
          <img className='-rotate-[12deg] rounded-[16px] aspect-square object-cover border-[8px] border-white shadow-xl' src='https://images.unsplash.com/photo-1592609931095-54a2168ae893?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
        </motion.div>

        <motion.div
        className="h-40 w-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: .8,
          delay: 0.7,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        >
          <img className='rotate-[8deg] rounded-[16px] aspect-square object-cover border-[8px] border-white shadow-xl' src='https://plus.unsplash.com/premium_photo-1661382011487-cd3d6b1d9dff?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
        </motion.div>

        <motion.div
        className="h-40 w-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: .8,
          delay: 0.8,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        >
          <img className='-rotate-[8deg] rounded-[16px] aspect-square object-cover border-[8px] border-white shadow-xl' src='https://plus.unsplash.com/premium_photo-1661589359769-44f3eb66b5db?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
        </motion.div>

        <motion.div
        className="h-40 w-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: .8,
          delay: 0.9,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        >
          <img className='rotate-[2deg] rounded-[16px] aspect-square object-cover border-[8px] border-white shadow-xl' src='https://images.unsplash.com/photo-1560461396-ec0ef7bb29dd?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
        </motion.div>
      </div>
      <div className='mt-32 mx-auto max-w-md mb-2 gap-y-4 flex flex-col'>
        {/* <Input type="search" placeholder="Search article/writing" className='rounded-xl mt-4 mb-8' /> */}
        <h1 className='text-xl pixel-typeface'>Recent Post</h1>
      </div>
      <div className='mx-auto max-w-md mb-12 gap-y-4 flex flex-col blogslists'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          currentBlogs.map(blogItem => (
            <Link to={`${blogItem.note_uuid}`} className='py-4 space-y-2 border-b border-stone-200' key={blogItem.id}>
              <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-2xl hover:underline'>{blogItem.title}</h1>
              </div>
              <p className='text-sm line-clamp-2 font-light'><HtmlRenderer html={blogItem.note_text} /></p>
              <p className='text-xs font-light text-muted-foreground'>{formatCreatedAt(blogItem.created_at)}</p>
            </Link>
          ))
        )}
      </div>
      <div className='flex justify-center mb-4'>
        <nav>
          <ul className='flex list-none'>
            {pageNumbers.map(number => (
              <li key={number} className='mx-1'>
                <button onClick={() => paginate(number)} className={`h-8 w-8 text-xs rounded-lg ${currentPage === number ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className='mt-12 mx-auto max-w-md mb-2 gap-y-4 flex flex-col'>
        <Footer />
      </div>
    </div>
  );
}
