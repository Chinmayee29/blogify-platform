import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Spinner, Alert, Button, Image } from 'react-bootstrap';
import { getPostById, deletePost } from '../features/postSlice';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, isLoading, isError, message } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [dispatch, id]);

  const isOwner = user && post && (user._id === (post.author?._id || post.author));

  const handleDelete = async () => {
    try {
      await dispatch(deletePost(post._id)).unwrap();
      navigate('/');
    } catch (_) {
      // error is already in slice state; optionally show alert via slice message
    }
  };

  return (
    <Container className="content-box my-4"> {/* <-- THIS LINE IS UPDATED */}
      {isLoading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {isError && !isLoading && (
        <Alert variant="danger">{message || 'Failed to load post'}</Alert>
      )}

      {!isLoading && !isError && post && (
        <>
          {post.imageUrl && (
            <Image src={post.imageUrl} fluid className="mb-3" />
          )}
          <h1 className="mb-3">{post.title}</h1>
          {isOwner && (
            <div className="mb-3">
              <Button variant="danger" size="sm" onClick={handleDelete}>Delete Post</Button>
            </div>
          )}
          <div>{post.content}</div>
        </>
      )}
    </Container>
  );
};

export default PostDetailPage;