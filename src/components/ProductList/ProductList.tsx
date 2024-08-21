import { useState, useEffect, useRef, useCallback } from "react"
import { Product } from "./types"
import { Card, Col, Row } from "react-bootstrap";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);

  const elementRef = useRef<HTMLDivElement>(null);

  const fetchMoreProducts = useCallback(async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}?limit=10&skip=${page * 10}`
    );
    const data = await response.json();

    if (data.products.length === 0) {
      setHasMore(false);
    } else {
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setPage((prevPage) => prevPage + 1);
    }
  }, [page]);

  const handleInterception = useCallback((entries: IntersectionObserverEntry[]) => {
     const target = entries[0];
     if (target.isIntersecting && hasMore) {
       fetchMoreProducts();
     }
  }, [hasMore, fetchMoreProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleInterception);
    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [products, handleInterception]);

  return (
    <div>
      {products.map((product) => (
        <Card key={product.id} style={{ marginBottom: "15px" }}>
          <Row>
            <Col md={4}>
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{ width: "100%" }}
              />
            </Col>
            <Col md={8}>
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>
                  <strong>{product.price}</strong>
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ))}
      {hasMore && <div ref={elementRef}>Loading...</div>}
    </div>
  );
}

export default ProductList