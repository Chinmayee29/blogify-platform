import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getPosts } from '../features/postSlice';
import PostItem from '../components/PostItem';

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, isError, message } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <Container className="py-4">
      {isLoading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {isError && !isLoading && (
        <Alert variant="danger">{message || 'Failed to load posts'}</Alert>
      )}

      {!isLoading && !isError && posts && posts.length > 0 && (
        <Row>
          {posts.map((post) => (
            <Col key={post._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <PostItem post={post} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HomePage;


