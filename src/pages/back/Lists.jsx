import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import parse from 'html-react-parser';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Ban, Dot, MoreHorizontal, PlusCircle } from 'lucide-react';
import Info from '../Info';
import supabase from '../SupabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function Lists() {
  const [blog, setBlog] = useState([]);
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlog = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error.message);
      return;
    }

    setBlog(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const initializeLink = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        fetchBlog();
      }
    } catch (error) {
      console.error('Error fetching session:', error.message);
    }
  };

  useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession);
      if (updatedSession && updatedSession.user) {
        fetchBlog();
      }
    });

    initializeLink();

    return () => authListener.data.subscription.unsubscribe();
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

  const handleDeleteNote = async (noteId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this note?');
    if (!isConfirmed) return;

    try {
      const { data, error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting timeline note:', error.message);
        return;
      }
      fetchBlog();
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getReadingTime = (text) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = text.split(/\s+/).length; // Split by spaces and count words
    return Math.ceil(words / wordsPerMinute); // Calculate minutes
  };

  const handleEditNote = (noteNoteuuid) => {
    navigate(`/writings/${noteNoteuuid}/edit`);
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blog.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(blog.length / blogsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (!session) {
    return (
      <div className='grid h-[100svh] place-items-center'>
        <Helmet>
          <title>404</title>
        </Helmet>
        <div className='max-w-[350px] relative items-center justify-center flex'>
          <div className='border border-zinc-100 rounded-full p-6'>
            <div className='border border-zinc-200 rounded-full p-6'>
              <div className='border border-zinc-200 rounded-full p-6'>
                <div className='border border-zinc-200 rounded-full p-6'>
                  <h1 className='pixel-typeface text-[3rem] font-bold text-center'>404</h1>
                </div>
              </div>
            </div>
          </div>
          <div className='absolute bottom-[25%] flex flex-col items-center justify-center'>
            <p className='font-semibold text-lg pixel-typeface'>Forbidden!</p>
            <p className='text-xs font-light text-muted-foreground pixel-typeface'>To access this page, you must be an author.</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='container mx-auto bg-stone-100 h-max min-h-screen rounded-xl p-4 m-4'>
        <Helmet>
          <title>Writings</title>
        </Helmet>
        <div className='flex mx-auto max-w-lg items-center justify-between pt-8 pb-4 gap-x-2'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Writing List</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className='flex mx-auto max-w-lg items-center justify-between h-[20vh] gap-x-2'>
          <div className='flex flex-col gap-x-2 items-start gap-2'>
            <h1 className='text-2xl font-semibold flex items-center gap-x-2'>Writing List</h1>
            <Link to='/create' >
              <Button className='rounded-xl'>
                <PlusCircle className='h-4 w-4 mr-2' />
                Create
              </Button>
            </Link>
          </div>
          <Info />
        </div>
        <div className='mx-auto max-w-lg mb-12 gap-y-4 flex flex-col blogslists'>
          {isLoading ? (
            <div className='grid h-screen place-items-center text-muted-foreground font-light text-sm'>Loading...</div>
          ) : (
            currentBlogs.map(blogItem => (
              <div className='py-4 space-y-2 border-b border-stone-200' key={blogItem.id}>
                <div className='flex items-center justify-between'>
                  <Link to={blogItem.note_uuid} className='hover:underline'>
                    <h1 className='font-semibold text-xl md:text-2xl'>{blogItem.title}</h1>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' className='bg-transparent border-none w-8 h-8' size='icon'><MoreHorizontal /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-32 z-50">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleEditNote(blogItem.note_uuid)}>
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='text-rose-500 hover:text-rose-800' onClick={() => handleDeleteNote(blogItem.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className='text-sm line-clamp-2'><HtmlRenderer html={blogItem.note_text} /></p>
                <div className='flex items-center'>
                <p className='text-xs font-light text-muted-foreground'>{formatCreatedAt(blogItem.created_at)}</p>
                <Dot className='text-stone-500' />
                <p className='text-xs font-light text-muted-foreground'>{getReadingTime(blogItem.note_text)} min read</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className='flex justify-center mb-4'>
          <nav>
            <ul className='flex list-none'>
              {pageNumbers.map(number => (
                <li key={number} className='mx-1'>
                  <button onClick={() => paginate(number)} className={`h-8 w-8 text-xs rounded-lg  ${currentPage === number ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
