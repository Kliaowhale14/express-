SELECT *
 FROM product_list;
 

 --複選 in
 SELECT *
 FROM my_product
 WHERE brand IN ('Apple','Google');

 --複選WHERE brand = 'Apple' OR brand = 'Google';
  SELECT *
 FROM my_product
 WHERE brand = 'Apple' OR brand = 'Google';

 --關鍵字 名稱查詢 (name_like = sa) 名字任意帶有sa的東西

 SELECT *
 FROM my_product
 WHERE name LIKE '%sa%';

 SELECT *
FROM my_product
WHERE price >= 5000 AND price <=15000;

SELECT *
FROM my_product
WHERE brand IN ('Apple', 'Google')
AND name LIKE '%sa%'
AND price >= 5000 AND price <=15000;

SELECT *
FROM my_product
WHERE brand IN ('Apple', 'Google')
ORDER BY price ASC;

--分頁查詢 qs pgae=2&page=5 
--LIMIT = perpage
--     offset = (page-1)*perpage

SELECT *
FROM my_product
WHERE brand IN ('Apple', 'Google')
ORDER LIMIT OFFSET 5;
