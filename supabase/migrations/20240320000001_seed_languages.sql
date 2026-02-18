-- Seed Courses
INSERT INTO public.courses (title, description, difficulty, "order", language, image_url)
VALUES
('Jaclang Mastery', 'Learn the Object Spatial Paradigm and how to build graph-based applications.', 'Intermediate', 1, 'jaclang', null),
('Python for Beginners', 'Master the basics of Python programming, the world''s most popular language.', 'Beginner', 2, 'python', null),
('Fullstack JavaScript', 'Learn Modern JavaScript from scratch to build interactive web apps.', 'Beginner', 3, 'javascript', null);

-- Seed Lessons for Jaclang
WITH jac_course AS (SELECT id FROM public.courses WHERE language = 'jaclang' LIMIT 1)
INSERT INTO public.lessons (course_id, title, content, "order", xp_reward, code_template, expected_output)
VALUES
((SELECT id FROM jac_course), 'Introduction to Walkers', 'Walkers are the primary way to traverse graphs...', 1, 10, 'walker greet { can visit { print("Hello!"); } }', 'Hello!'),
((SELECT id FROM jac_course), 'Nodes and Edges', 'Nodes store data, Edges connect them...', 2, 15, 'node root {}', 'Program executed successfully.');

-- Seed Lessons for Python
WITH py_course AS (SELECT id FROM public.courses WHERE language = 'python' LIMIT 1)
INSERT INTO public.lessons (course_id, title, content, "order", xp_reward, code_template, expected_output)
VALUES
((SELECT id FROM py_course), 'Hello Python', 'Python uses print() to output text...', 1, 10, 'print("Hello Python!")', 'Hello Python!'),
((SELECT id FROM py_course), 'Variables and Types', 'Python is dynamically typed...', 2, 15, 'x = 5\nprint(x)', '5');

-- Seed Lessons for JS
WITH js_course AS (SELECT id FROM public.courses WHERE language = 'javascript' LIMIT 1)
INSERT INTO public.lessons (course_id, title, content, "order", xp_reward, code_template, expected_output)
VALUES
((SELECT id FROM js_course), 'Console Logging', 'JavaScript uses console.log()...', 1, 10, 'console.log("Hello JS!")', 'Hello JS!'),
((SELECT id FROM js_course), 'Modern ES6+', 'Arrow functions and more...', 2, 20, 'const greet = () => console.log("Hi");\ngreet();', 'Hi');
