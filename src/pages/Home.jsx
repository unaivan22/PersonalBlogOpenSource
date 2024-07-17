import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import supabase from './SupabaseClient';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import Check from './Check';
import { Dot } from 'lucide-react';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(8);
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
          return domNode.data.trim();
        }
      },
    });

    return <>{parsedHtml}</>;
  };

  const getReadingTime = (text) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = text.split(/\s+/).length; // Split by spaces and count words
    return Math.ceil(words / wordsPerMinute); // Calculate minutes
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
    <div>
      <Check />
      <div className='container mx-auto h-max min-h-screen rounded-xl p-4 m-4'>
        <div className='flex items-center justify-center h-[30vh] lg:h-[40vh] gap-x-2'>
          <h1 className='text-[4rem] lg:text-[6rem] font-light opacity-60'>Ivan's</h1>
          <h1 className='text-[4rem] lg:text-[6rem] font-light opacity-60'>Blog </h1>
        </div>
        <div className='mt-32 mx-auto md:px-12 mb-2 gap-y-4 flex flex-col'>
          <h1 className='text-xl font-semibold'>Recent Post</h1>
        </div>
        <div className='mx-auto md:px-12 mb-12 gap-8 grid lg:grid-cols-4 md:grid-cols-2 blogslists'>
          {isLoading ? (
            <div className='grid h-[50vh] place-items-center'>Loading...</div>
          ) : (
            currentBlogs.map(blogItem => (
              <Link to={`${blogItem.note_uuid}`} className='py-4 space-y-2' key={blogItem.id}>
                <img src={blogItem.thumbnail} className='show rounded-xl w-full h-40 object-cover'/>
                <div className='flex items-center justify-between'>
                  <h1 className='font-semibold text-2xl hover:underline line-clamp-3'>{blogItem.title}</h1>
                </div>
                <p className='text-sm line-clamp-2 font-light'><HtmlRenderer html={blogItem.note_text} /></p>
                <div className='flex items-center'>
                  <p className='text-xs font-light text-muted-foreground'>{formatCreatedAt(blogItem.created_at)}</p>
                  <Dot className='text-stone-500' />
                  <p className='text-xs font-light text-muted-foreground'>{getReadingTime(blogItem.note_text)} min read</p>
                </div>
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
        <div className='mt-12 mx-auto md:px-12 mb-2 gap-y-4 flex flex-col'>
          <Footer />
        </div>
      </div>
    </div>
  );
}
