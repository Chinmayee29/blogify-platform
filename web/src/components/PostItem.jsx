import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PostItem = ({ post }) => {
  const [hovered, setHovered] = useState(false);

  const snippet = (post?.content || '').length > 140
    ? `${post.content.slice(0, 140)}...`
    : post?.content || '';

  return (
    <Card
      as={Link}
      to={`/post/${post._id}`}
      className="text-reset text-decoration-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 0.5rem 1rem rgba(0,0,0,0.15)' : '0 0.125rem 0.25rem rgba(0,0,0,0.075)'
      }}
    >
      <Card.Body>
        <Card.Title className="mb-2">{post.title}</Card.Title>
        <Card.Text className="text-muted mb-0">{snippet}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PostItem;


