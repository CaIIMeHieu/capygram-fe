/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion } from 'framer-motion';

import images from '@/assets/images/images.png';
import heart from '@/assets/images/heart.png';
import comment from '@/assets/images/comment.png';

import './Explore.scss';
import ExploreItem from './ExploreItem';
import { getAllPosts } from '@/api/authApi/post';
import { AppContext } from '@/context/AppProvider';

const Explore = () => {
  const [exploreData, setExploreData] = useState([]);
  const [page, setPage] = useState(1);
  const [showItem, setShowItem] = useState(false);
  const [item, setItem] = useState(undefined);
  const [idItem, setIdItem] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(16);
  const { setIsLoading } = useContext(AppContext)

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const post = await getAllPosts(page, limit);
        // console.log("post:", post.data);
        if (post.data.length > 0) {
          setExploreData(prev => page === 1 ? post.data : [...prev, ...post.data]);
          setTotal(post.total);
          setHasMore(exploreData.length + post.data.length < post.total);
        } else {
          setHasMore(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setHasMore(false);
      }
    }
    getPosts();
  }, [page]);

  const fetchMoreData = () => {
    if (exploreData.length >= total) {
      setHasMore(false);
      return;
    }
    if (page === 1) {
      setPage(5);
    }
    else {
      setPage(prev => prev + 1);
    }

    setLimit(4);
  };

  const handleCancel = () => {
    setShowItem(false);
  };

  const handleClick = (explore) => {
    setItem(explore);
    setIdItem(explore.id);
    setShowItem(true);
  }
  return (
    <InfiniteScroll
      dataLength={exploreData.length}
      next={fetchMoreData}
      hasMore={true}
    // loader={<h4>Loading...</h4>}
    >
      <div className='body-list-explore' style={{ position: "absolute", left: "16%" }}>

        <div className='body-explore' >
          {
            (exploreData && exploreData.length > 0) && exploreData.map((explore) => (
              <>
                <div key={explore.id} className='item' onClick={() => handleClick(explore)}>
                  <div className='i' style={{ cursor: 'pointer' }}>
                    <img src={explore.imageUrls[0]} alt='explore' className='img' />
                    <img src={images} alt='images' className='icon1' />
                    <div className='hover'>
                      <div className='icon2'>
                        <img src={heart} alt='heart' />
                        <p>{explore.likes}</p>
                      </div>
                      <div className='icon3'>
                        <img src={comment} alt='comment' />
                        <p>{explore.comments ? explore.comments : 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))
          }

          {showItem && (
            <div className='overlay' onClick={handleCancel}>
              <motion.div
                className='item-explore-container'
                onClick={(e) => e.stopPropagation()}
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <ExploreItem onCancel={handleCancel} explore={item} id={idItem} />
              </motion.div>
            </div>
          )}
        </div>
      </div >
    </InfiniteScroll>
  )
}

export default Explore;

