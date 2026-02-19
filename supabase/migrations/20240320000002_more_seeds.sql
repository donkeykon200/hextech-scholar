-- Seed Courses for Java and C++
INSERT INTO public.courses (title, description, difficulty, "order", language, image_url)
VALUES
('Java Core', 'Learn object-oriented programming with Java.', 'Intermediate', 4, 'java', null),
('High Performance C++', 'Master memory management and performance with C++.', 'Advanced', 5, 'cpp', null);

-- Seed Lessons for Java
WITH java_course AS (SELECT id FROM public.courses WHERE language = 'java' LIMIT 1)
INSERT INTO public.lessons (course_id, title, content, "order", xp_reward, code_template, expected_output)
VALUES
((SELECT id FROM java_course), 'Hello Java', 'Java programs start with a Main class.', 1, 10, 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java!");\n    }\n}', 'Hello Java!'),
((SELECT id FROM java_course), 'Classes and Objects', 'Everything in Java is an object...', 2, 15, 'public class User {\n    String name = "Jules";\n}\n// main logic...', 'Jules');

-- Seed Lessons for C++
WITH cpp_course AS (SELECT id FROM public.courses WHERE language = 'cpp' LIMIT 1)
INSERT INTO public.lessons (course_id, title, content, "order", xp_reward, code_template, expected_output)
VALUES
((SELECT id FROM cpp_course), 'Hello C++', 'C++ uses iostream for output.', 1, 10, '#include <iostream>\n\nint main() {\n    std::cout << "Hello C++!" << std::endl;\n    return 0;\n}', 'Hello C++!'),
((SELECT id FROM cpp_course), 'Pointers and Memory', 'Manual memory management is key in C++...', 2, 20, 'int main() {\n    int* p = new int(10);\n    std::cout << *p;\n    delete p;\n    return 0;\n}', '10');
