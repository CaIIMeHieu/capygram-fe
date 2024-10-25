/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { Carousel } from "antd";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUserById } from "@/api/authApi/auth";
import ShowMoreOption from "./ShowMoreOption";
import CardUser from "./CardUser";
import { follow, getFollowing, unFollow } from "@/api/authApi/graph";
import ShareTo from "./ShareTo";
import { SuggestionsContext } from "../home/SuggestionsContext";

import more from "@/assets/images/more.png";
import icon from "@/assets/images/icon.png";
import account from "@/assets/images/account.png";

import "./ExploreItem.scss";

const ExploreItem = ({ explore, onCancel, id }) => {
  const [showCardUser, setShowCardUser] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const { comments, addComment, likes, toggleLike, userLikes } =
    useContext(SuggestionsContext);
  const [input, setInput] = useState("");
  const postComments = comments[explore.id] || [];
  const [isFollow, setIsFollow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [like, setLike] = useState(false);
  const [loved, setLoved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [user, setUser] = useState({});
  const [isRender, setIsRender] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // Cập nhật trạng thái thích

  const { t } = useTranslation("explore");
  const videoRef = useRef([]);
  const inputRef = React.createRef();
  const me = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setHovering(true);
    setShowCardUser(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setTimeout(() => {
      if (!hovering) {
        setShowCardUser(false);
      }
    }, 500);
  };
  // Xử lý trạng thái thích
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const likedPosts = userLikes[userId] || [];
    setIsLiked(likedPosts.includes(explore.id));
  }, [userLikes, explore.id]);

  // Xử lý nút like
  const handleLikeToggle = () => {
    toggleLike(explore.id);
  };
  const addEmoji = (event, emojiObject) => {
    const emoji = event.emoji;
    const { selectionStart, selectionEnd } = inputRef.current;
    const start = input.substring(0, selectionStart);
    const end = input.substring(selectionEnd, input.length);
    const updateInput = start + emoji + end;
    setInput(updateInput);
    inputRef.current.focus();
  };

  useEffect(() => {
    const getData = async () => {
      const res = await getUserById(explore.userId);
      setUser(res);

      const userId = localStorage.getItem("userId");

      //những người mình follow
      const followings = await getFollowing(userId);

      //kiểm tra xem mk đã follow người này chưa
      const isFollow = followings.some(
        (followingId) => followingId.id === explore.userId
      );

      setIsFollow(isFollow ? true : false);
    };

    getData();
  }, [explore.id, id, isRender]);

  const handleSend = () => {
    if (input.trim() !== "") {
      const newComment = {
        user: me,
        comment: input.trim(),
        exploreId: explore.id,
      };
      addComment(explore.id, newComment);
      setInput(""); // Xóa nội dung ô input sau khi gửi bình luận
    }
  };
  const handleCancelShowMore = () => {
    setShowMore(false);
  };

  const handleCancelShare = () => {
    setShowShare(false);
  };

  const handleClickFollow = async () => {
    const userId = localStorage.getItem("userId");

    if (isFollow) {
      // Unfollow
      // await unFollow(userId, explore.userId);
      setIsFollow(false);
      await unFollow(userId, explore.userId);
    } else {
      // Follow
      // await follow(userId, explore.userId);
      setIsFollow(true);
      await follow(userId, explore.userId);
    }

    setIsRender(!isRender);
  };

  const handleClickProfileUser = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="body-item">
      <div className="item-explore">
        <div className="image-video">
          <div className="i">
            <Carousel arrows infinite={false}>
              {explore.imageUrls.map((url, index) => (
                <div className="image-slider">
                  <img src={url} alt="image" key={index} className="img-item" />
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        <div className="content-explore">
          <div className="top-content-explore">
            <div className="info-user">
              <img
                style={{ cursor: "pointer" }}
                src={
                  user?.profile?.avatarUrl !== ("string" && "")
                    ? user?.profile?.avatarUrl
                    : account
                }
                className="avatar-info"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              <p
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClickProfileUser(user.id)}
              >
                <b style={{ cursor: "pointer" }}>{user?.userName}</b>
              </p>
              <p
                style={{ cursor: "pointer" }}
                className={`fl ${isFollow ? "isFollow" : ""}`}
                onClick={handleClickFollow}
              >
                {explore.userId === localStorage.getItem("userId")
                  ? ""
                  : isFollow === false
                  ? t("follow")
                  : t("unfollow")}
              </p>

              {showCardUser && (
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => setShowCardUser(false)}
                >
                  <CardUser
                    user={user}
                    Follow={isFollow}
                    setIsRender={setIsRender}
                    isRender={isRender}
                    handleClickFollow={handleClickFollow}
                  />
                </div>
              )}

              {showMore && (
                <div className="overlay" onClick={handleCancelShowMore}>
                  <motion.div
                    className="item-explore-container"
                    onClick={(e) => e.stopPropagation()}
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ShowMoreOption onCancel={handleCancelShowMore} />
                  </motion.div>
                </div>
              )}
            </div>

            <div className="icon-loadMore">
              <img
                style={{ cursor: "pointer" }}
                src={more}
                alt="more"
                onClick={() => setShowMore(true)}
              />
            </div>
          </div>

          <div className="comment-explore">
            {postComments.map((comment, index) => (
              <div className="comment-item" key={index}>
                <div className="info-user-comment">
                  <img
                    src={comment.user.avatarUrl || account}
                    alt="avatar-info-user-comment"
                  />
                </div>
                <div className="content-comment">
                  <p>
                    <b>{comment.user.username}</b>
                  </p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bottom-explore">
            <div className="bottom1-explore">
              <div className="gr-icon">
                <div className="gr-icon1">
                  <span onClick={() => setLoved(!loved)}>
                    {isLiked ? (
                      <i
                        className="fa-solid fa-heart"
                        style={{
                          color: "#f20d0d",
                          scale: "1.1",
                          cursor: "pointer",
                        }}
                        onClick={handleLikeToggle}
                      ></i>
                    ) : (
                      <i
                        style={{ cursor: "pointer" }}
                        className="fa-regular fa-heart"
                        onClick={handleLikeToggle}
                      ></i>
                    )}
                  </span>
                  <span>
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa-regular fa-comment"
                    ></i>
                  </span>
                  <span onClick={() => setShowShare(true)}>
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa-regular fa-paper-plane"
                    ></i>
                  </span>
                </div>
                {showShare && (
                  <div className="overlay" onClick={handleCancelShare}>
                    <motion.div
                      className="item-explore-container"
                      onClick={(e) => e.stopPropagation()}
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ShareTo onCancel={handleCancelShare} />
                    </motion.div>
                  </div>
                )}
                <div className="gr-icon2">
                  <span onClick={() => setLike(!like)}>
                    {!like ? (
                      <i className="fa-regular fa-bookmark"></i>
                    ) : (
                      <i className="fa-solid fa-bookmark"></i>
                    )}
                  </span>
                </div>
              </div>
              <div className="count-liked">
                <p>
                  {Object.keys(likes).filter((id) => id === explore.id).length}{" "}
                  {t("liked")}
                </p>
              </div>
            </div>

            <div className="bottom2-explore">
              <img
                style={{ cursor: "pointer" }}
                src={icon}
                alt="icon"
                onClick={() => setShowEmoji(!showEmoji)}
              />
              <textarea
                placeholder={t("comment")}
                typeof="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onClick={() => setShowEmoji(false)}
                ref={inputRef}
              />
              <p
                style={{ cursor: "pointer" }}
                className={input !== "" ? "send" : "notSend"}
                onClick={handleSend}
              >
                {t("send")}
              </p>
            </div>

            {showEmoji && (
              <EmojiPicker
                onEmojiClick={addEmoji}
                className="emoji-picker-react"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreItem;
