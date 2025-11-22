-- Insert 28 scholarships into the database
-- Run this SQL in your Supabase SQL Editor after running schema.sql

-- MERIT-BASED SCHOLARSHIPS
INSERT INTO scholarships (title, organization, description, criteria, amount, deadline, essay_prompts, winner_stories, requirements, tags) VALUES
(
  'Coca-Cola Scholars Program',
  'The Coca-Cola Scholars Foundation',
  'Awards students who demonstrate academic excellence, leadership, and commitment to making a difference in their schools and communities.',
  'U.S. high school seniors with high academic achievement and demonstrated service leadership. Must have minimum 3.0 GPA at end of junior year and be planning to pursue higher education.',
  20000,
  '2025-10-31',
  '[
    {"question": "Describe your leadership impact in your school or community. What change did you create and how did it affect others?", "word_limit": 500},
    {"question": "How have your academic achievements prepared you to make a difference in the world?", "word_limit": 400}
  ]'::jsonb,
  ARRAY[
    'Winner: Maria led a tutoring program that improved reading scores for 50+ elementary students. She emphasized her sustained commitment over 3 years and quantifiable impact.',
    'Winner: James founded a community garden that fed 30 families. His essay focused on mobilizing volunteers and creating sustainable change.'
  ],
  '{"gpa_min": 3.0, "grade_level": ["12th Grade"], "citizenship": ["U.S. Citizen", "Permanent Resident"]}'::jsonb,
  ARRAY['Merit', 'Leadership', 'Community Service']
),
(
  'National Merit Scholarship',
  'National Merit Scholarship Corporation',
  'Honors academic excellence, analytical ability, and rigorous coursework based on PSAT/NMSQT scores.',
  'PSAT top scorers who qualify as Semifinalists. Must be U.S. citizens or permanent residents, have exceptional academic record, be endorsed by school, and write an essay.',
  2500,
  '2026-02-01',
  '[
    {"question": "Describe your personal accomplishments and educational goals. What motivates your academic pursuits?", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Chen wrote about her independent research in molecular biology, emphasizing intellectual curiosity and academic rigor.',
    'Winner: David discussed his passion for mathematics and plans to pursue theoretical physics, highlighting AP course load and self-study.'
  ],
  '{"qualification": ["PSAT Semifinalist"], "citizenship": ["U.S. Citizen", "Permanent Resident"]}'::jsonb,
  ARRAY['Merit', 'Academic Excellence']
),
(
  'Cameron Impact Scholarship',
  'Bryan Cameron Education Foundation',
  'Awards high-achieving students with strong leadership and community impact who plan to effect positive change in the world.',
  'High school seniors with exceptional academic achievement, demonstrated leadership, and commitment to community service. Must plan to attend accredited 4-year university.',
  140000,
  '2025-09-10',
  '[
    {"question": "Discuss a time you made a meaningful impact in your community. What was the challenge, your approach, and the lasting effect?", "word_limit": 750}
  ]'::jsonb,
  ARRAY[
    'Winner: Sarah created a coding bootcamp for underserved youth, teaching 100+ students. She emphasized scalability and long-term mentor relationships.',
    'Winner: Miguel organized town halls to improve youth mental health resources, leading to policy changes. He focused on systemic impact.'
  ],
  '{"gpa_min": 3.7, "grade_level": ["12th Grade"]}'::jsonb,
  ARRAY['Merit', 'Leadership', 'Community Service']
),
(
  'Elks Most Valuable Student Scholarship',
  'Elks National Foundation',
  'Looks for well-rounded student achievement, service, and financial need. Rewards students who excel academically while contributing to their communities.',
  'High school seniors who are U.S. citizens with strong academic record, demonstrated leadership, and financial need.',
  12500,
  '2025-11-15',
  '[
    {"question": "Describe your future career goals and how your leadership experiences have prepared you for success.", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Lisa wrote about her goal to become a pediatrician, linking it to her volunteer work at children''s hospitals.',
    'Winner: Andre discussed engineering aspirations, connecting them to his robotics team leadership and community tech workshops.'
  ],
  '{"grade_level": ["12th Grade"], "citizenship": ["U.S. Citizen"], "financial_need": true}'::jsonb,
  ARRAY['Merit', 'Leadership', 'Financial Need']
),
(
  'GE-Reagan Foundation Scholarship',
  'Ronald Reagan Presidential Foundation',
  'Recognizes students who demonstrate leadership, drive, integrity, and citizenship. Values character, community service, and academic excellence.',
  'High school seniors with minimum 3.0 GPA, demonstrated leadership, and plans to attend accredited 4-year university. Must demonstrate integrity and citizenship.',
  10000,
  '2026-01-15',
  '[
    {"question": "Demonstrate how you have shown leadership through challenges. What obstacle did you face and how did you lead others through it?", "word_limit": 600}
  ]'::jsonb,
  ARRAY[
    'Winner: Emma led her school through implementing a mental health awareness program after tragic loss, showing resilience and compassion.',
    'Winner: Marcus organized community response to natural disaster, emphasizing servant leadership and bringing people together.'
  ],
  '{"gpa_min": 3.0, "grade_level": ["12th Grade"]}'::jsonb,
  ARRAY['Merit', 'Leadership', 'Character']
),
(
  'Equitable Excellence Scholarship',
  'Equitable Foundation',
  'Recognizes students with drive, determination, and community commitment who have overcome challenges to achieve their goals.',
  'U.S. high school seniors who demonstrate resilience, academic achievement, and commitment to their communities.',
  25000,
  '2025-12-15',
  '[
    {"question": "Explain a significant challenge you faced and how you overcame it. What did you learn and how did it shape who you are today?", "word_limit": 650}
  ]'::jsonb,
  ARRAY[
    'Winner: Jasmine wrote about overcoming homelessness while maintaining 4.0 GPA and founding peer support group.',
    'Winner: Kevin discussed being first-generation immigrant, learning English, and becoming valedictorian through persistence.'
  ],
  '{"grade_level": ["12th Grade"], "citizenship": ["U.S. Citizen", "Permanent Resident"]}'::jsonb,
  ARRAY['Merit', 'Resilience', 'Community Service']
),
(
  'Horatio Alger National Scholarship',
  'Horatio Alger Association',
  'Awards low-income students who have faced and overcome great obstacles, demonstrating resilience, perseverance, and ambition despite adversity.',
  'High school seniors with critical financial need (family income under $55,000), strong academic performance despite challenges, and demonstrated perseverance.',
  25000,
  '2025-10-25',
  '[
    {"question": "Describe the adversity you have faced and how you overcame it. How has this experience shaped your character and goals?", "word_limit": 800}
  ]'::jsonb,
  ARRAY[
    'Winner: Destiny wrote about caring for disabled parent while excelling in school, emphasizing resilience and determination.',
    'Winner: Carlos discussed escaping gang violence, finding refuge in education, and aspiring to become social worker to help others.'
  ],
  '{"family_income_max": 55000, "grade_level": ["12th Grade"], "citizenship": ["U.S. Citizen"]}'::jsonb,
  ARRAY['Merit', 'Financial Need', 'Resilience']
);

-- COMMUNITY SERVICE SCHOLARSHIPS
INSERT INTO scholarships (title, organization, description, criteria, amount, deadline, essay_prompts, winner_stories, requirements, tags) VALUES
(
  'Prudential Spirit of Community Awards',
  'Prudential Financial',
  'Honors students who demonstrate exceptional volunteer service and civic engagement with long-term community impact.',
  'Middle and high school students who have made meaningful contributions to their communities through volunteer service in past 12 months.',
  1000,
  '2025-11-08',
  '[
    {"question": "Describe your most meaningful service project. What community need did you address, what was your role, and what was the impact?", "word_limit": 700}
  ]'::jsonb,
  ARRAY[
    'Winner: Sophia organized 500+ volunteers to plant 5,000 trees, emphasizing environmental impact and community mobilization.',
    'Winner: Jamal created mentorship program pairing high schoolers with at-risk youth, showing sustained 3-year commitment.'
  ],
  '{"grade_level": ["6th-12th Grade"]}'::jsonb,
  ARRAY['Community Service', 'Leadership', 'Civic Engagement']
),
(
  'DoSomething.org Scholarships',
  'DoSomething.org',
  'Awards students who complete service-based challenges focused on social impact and youth activism.',
  'Students who participate in DoSomething campaigns and complete service projects addressing social issues.',
  5000,
  '2026-06-30',
  '[
    {"question": "Describe the impact of your service project. How many people did you reach and what changed?", "word_limit": 300}
  ]'::jsonb,
  ARRAY[
    'Winner: Taylor ran campaign collecting 2,000 coats for homeless, emphasizing grassroots organizing and measurable impact.',
    'Winner: Priya organized petition for school mental health resources that led to hiring 2 counselors.'
  ],
  '{"grade_level": ["9th-12th Grade, College"]}'::jsonb,
  ARRAY['Community Service', 'Social Impact', 'Activism']
),
(
  'Hershey Heartwarming Project Grant',
  'The Hershey Company',
  'Supports youth-led kindness and community-building projects that bring people together.',
  'Youth ages 5-18 leading projects that promote kindness, community connection, and positive change.',
  500,
  '2026-06-30',
  '[
    {"question": "Describe your project proposal and the community need it addresses. How will your project bring people together?", "word_limit": 400}
  ]'::jsonb,
  ARRAY[
    'Winner: Group created community care packages for isolated seniors, emphasizing intergenerational connection.',
    'Winner: Students organized neighborhood block parties to build connections between diverse families.'
  ],
  '{"age_range": ["5-18"]}'::jsonb,
  ARRAY['Community Service', 'Kindness', 'Youth Leadership']
),
(
  'Bonner Scholars Program',
  'Bonner Foundation',
  'For students committed to sustained community service (10+ hours/week) who demonstrate advocacy and civic leadership.',
  'First-year college students with financial need, commitment to 10 hours/week community service, and passion for social justice.',
  5000,
  '2026-02-01',
  '[
    {"question": "Why does community service matter to you? Describe your vision for creating long-term change.", "word_limit": 600}
  ]'::jsonb,
  ARRAY[
    'Winner: Maria wrote about growing up in underserved community and commitment to educational equity through tutoring.',
    'Winner: James discussed environmental justice work and plans to organize communities around climate action.'
  ],
  '{"financial_need": true, "service_commitment": "10+ hours/week"}'::jsonb,
  ARRAY['Community Service', 'Civic Leadership', 'Financial Need']
),
(
  'BBB Students of Integrity Scholarship',
  'Better Business Bureau',
  'Recognizes high school seniors who demonstrate ethics, integrity, and service to their communities.',
  'High school seniors in BBB service area who exemplify trustworthiness, integrity, and ethical leadership.',
  10000,
  '2025-11-30',
  '[
    {"question": "Describe a time when you demonstrated ethical leadership. What was the situation and how did you uphold your values?", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Sarah reported academic dishonesty despite peer pressure, then created honor code education program.',
    'Winner: Mike started transparency initiative for student government finances, building trust with student body.'
  ],
  '{"grade_level": ["12th Grade"]}'::jsonb,
  ARRAY['Community Service', 'Ethics', 'Leadership']
);

-- STEM / INNOVATION SCHOLARSHIPS
INSERT INTO scholarships (title, organization, description, criteria, amount, deadline, essay_prompts, winner_stories, requirements, tags) VALUES
(
  'Google Generation Scholarship',
  'Google',
  'For future tech leaders passionate about improving technology for all. Supports students pursuing computer science with commitment to diversity.',
  'Students pursuing CS or related major with strong academic record and demonstrated leadership. Emphasis on increasing diversity in tech.',
  10000,
  '2026-05-15',
  '[
    {"question": "Describe a technical project you built and how it demonstrates your passion for computer science.", "word_limit": 500},
    {"question": "How do you plan to contribute to increasing diversity and inclusion in technology?", "word_limit": 400}
  ]'::jsonb,
  ARRAY[
    'Winner: Aisha built app for elderly to connect with family, emphasizing accessible design and user research.',
    'Winner: Carlos created coding curriculum for underserved schools, teaching 200+ students, showing commitment to CS education equity.'
  ],
  '{"major": ["Computer Science", "Computer Engineering", "Related Technical Field"]}'::jsonb,
  ARRAY['STEM', 'Innovation', 'Diversity', 'Computer Science']
),
(
  'NSHSS STEM Scholarship',
  'National Society of High School Scholars',
  'Awards students pursuing STEM pathways who demonstrate creativity, research, and innovation.',
  'NSHSS members in good standing pursuing STEM major with strong academic achievement.',
  1000,
  '2026-03-31',
  '[
    {"question": "Describe your passion for STEM and your future goals in science, technology, engineering, or mathematics.", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Elena discussed biology research on antibiotic resistance, emphasizing hands-on lab work and scientific method.',
    'Winner: Ryan wrote about passion for renewable energy engineering and building solar-powered devices.'
  ],
  '{"membership": ["NSHSS"], "major": ["STEM"]}'::jsonb,
  ARRAY['STEM', 'Innovation', 'Research']
),
(
  'Amazon Future Engineer Scholarship',
  'Amazon',
  'Supports students from underserved backgrounds pursuing computer science with commitment to innovation and equity.',
  'High school seniors from underserved communities planning to major in CS, with financial need. Must demonstrate passion for computer science.',
  40000,
  '2026-01-30',
  '[
    {"question": "Describe a technology project that positively impacted your community. What problem did you solve and what was the outcome?", "word_limit": 600}
  ]'::jsonb,
  ARRAY[
    'Winner: Destiny created website for local food bank to coordinate volunteers, serving 1,000+ families more efficiently.',
    'Winner: Jose built mobile app connecting immigrant students with resources, downloaded 500+ times in his district.'
  ],
  '{"major": ["Computer Science"], "financial_need": true, "background": ["Underserved communities"]}'::jsonb,
  ARRAY['STEM', 'Innovation', 'Diversity', 'Financial Need']
),
(
  'Society of Women Engineers Scholarship',
  'Society of Women Engineers',
  'Supports women pursuing engineering degrees to increase diversity in engineering fields.',
  'Women pursuing ABET-accredited engineering, technology, or computer science programs.',
  16000,
  '2026-02-15',
  '[
    {"question": "Describe how you became interested in engineering. What sparked your passion and what do you hope to accomplish?", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Maya wrote about building robots with her father and aspiring to design prosthetics for amputees.',
    'Winner: Grace discussed being only girl in robotics club and mission to mentor other young women in STEM.'
  ],
  '{"gender": ["Female"], "major": ["Engineering", "Computer Science", "Technology"]}'::jsonb,
  ARRAY['STEM', 'Innovation', 'Diversity', 'Women in STEM']
),
(
  'Lockheed Martin STEM Scholarship',
  'Lockheed Martin',
  'For engineering and computer science majors with financial need who demonstrate strong interest in STEM and problem-solving.',
  'Students pursuing engineering or CS degree with demonstrated financial need and strong interest in defense technology and innovation.',
  10000,
  '2026-04-01',
  '[
    {"question": "Demonstrate your strong interest in STEM. What problems do you want to solve through engineering or computer science?", "word_limit": 550}
  ]'::jsonb,
  ARRAY[
    'Winner: Omar wrote about aerospace engineering passion and designing efficient aircraft to reduce carbon emissions.',
    'Winner: Rachel discussed cybersecurity interest and protecting critical infrastructure from threats.'
  ],
  '{"major": ["Engineering", "Computer Science"], "financial_need": true}'::jsonb,
  ARRAY['STEM', 'Innovation', 'Engineering', 'Financial Need']
);

-- LEADERSHIP SCHOLARSHIPS
INSERT INTO scholarships (title, organization, description, criteria, amount, deadline, essay_prompts, winner_stories, requirements, tags) VALUES
(
  'Jack Kent Cooke Young Scholars',
  'Jack Kent Cooke Foundation',
  'Awards high-achieving, low-income students who demonstrate perseverance, academic drive, and leadership potential.',
  '7th grade students with high academic achievement, financial need (family income up to $95,000), and demonstrated leadership.',
  40000,
  '2025-11-30',
  '[
    {"question": "Describe a leadership challenge you faced. How did you approach it and what did you learn?", "word_limit": 650}
  ]'::jsonb,
  ARRAY[
    'Winner: Kayla led school initiative to reduce bullying, training 50 peer mediators and reducing incidents by 40%.',
    'Winner: David organized community response to library closure, collecting 5,000 signatures and securing funding.'
  ],
  '{"grade_level": ["7th Grade"], "family_income_max": 95000}'::jsonb,
  ARRAY['Leadership', 'Merit', 'Financial Need']
),
(
  'Young American Award',
  'American Legion',
  'Recognizes high school juniors who demonstrate well-rounded excellence in academics, athletics, and community leadership.',
  'High school juniors with strong academic record, athletic participation, and demonstrated community leadership.',
  2500,
  '2026-03-15',
  '[
    {"question": "Demonstrate your well-rounded excellence across academics, athletics, and community service.", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Marcus balanced varsity soccer, 4.0 GPA, and leading community food drives serving 100+ families.',
    'Winner: Ashley juggled swim team captain, honor roll, and organizing charity runs raising $10,000 for cancer research.'
  ],
  '{"grade_level": ["11th Grade"]}'::jsonb,
  ARRAY['Leadership', 'Athletics', 'Community Service']
),
(
  'TD Scholarship for Community Leadership',
  'TD Bank',
  'For Canadian students who have made significant community impact and demonstrated change-making through long-term social impact projects.',
  'Canadian high school seniors with exceptional community leadership and commitment to long-term social change.',
  70000,
  '2025-11-30',
  '[
    {"question": "Tell the story of your community leadership. What issue did you address and what lasting change did you create?", "word_limit": 750}
  ]'::jsonb,
  ARRAY[
    'Winner: Sophie created province-wide youth mental health advocacy network, reaching 50 schools and influencing policy.',
    'Winner: Liam organized environmental sustainability program reducing school waste by 60% and spreading to 10 other schools.'
  ],
  '{"citizenship": ["Canadian"], "grade_level": ["12th Grade"]}'::jsonb,
  ARRAY['Leadership', 'Community Service', 'Social Impact']
),
(
  'U.S. Senate Youth Program',
  'Hearst Foundations',
  'For students demonstrating leadership in school government with interest in civic leadership and public policy.',
  'High school juniors and seniors serving in elected student government positions with demonstrated interest in public service.',
  10000,
  '2025-10-01',
  '[
    {"question": "Describe your political and civic engagement. Why are you interested in public service and policy?", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Natalie served as student body president, implemented new voting system, and interned with state senator.',
    'Winner: Chris organized voter registration drives, founded political awareness club, and testified at city council.'
  ],
  '{"grade_level": ["11th Grade", "12th Grade"], "position": ["Elected student government"]}'::jsonb,
  ARRAY['Leadership', 'Civic Engagement', 'Government']
);

-- DIVERSITY & INCLUSION SCHOLARSHIPS
INSERT INTO scholarships (title, organization, description, criteria, amount, deadline, essay_prompts, winner_stories, requirements, tags) VALUES
(
  'Gates Scholarship',
  'Bill & Melinda Gates Foundation',
  'Full-ride scholarship for low-income, minority students who demonstrate exceptional academic achievement, leadership, and perseverance.',
  'Pell-eligible minority students (African American, American Indian/Alaska Native, Asian Pacific Islander American, or Hispanic American) in top 10% of class.',
  200000,
  '2025-09-15',
  '[
    {"question": "Describe the hardships you have faced and how you overcame them.", "word_limit": 600},
    {"question": "Discuss your leadership experiences and how they have shaped you.", "word_limit": 600},
    {"question": "What are your educational and career goals?", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Jasmine wrote about being raised by single immigrant mother, working multiple jobs while maintaining 4.0, and aspiring to become doctor to serve underserved communities.',
    'Winner: Marcus discussed growing up in poverty, founding tutoring nonprofit for younger students, and pursuing engineering to create affordable technology.'
  ],
  '{"ethnicity": ["African American", "American Indian/Alaska Native", "Asian Pacific Islander American", "Hispanic American"], "pell_eligible": true, "class_rank": "Top 10%"}'::jsonb,
  ARRAY['Diversity', 'Financial Need', 'Merit', 'Leadership']
),
(
  'QuestBridge National College Match',
  'QuestBridge',
  'Full-ride scholarship match for low-income, high-achieving students who have overcome adversity with academic drive.',
  'High school seniors with strong academic record and household income less than $65,000 (typical).',
  200000,
  '2025-09-27',
  '[
    {"question": "Describe your personal background, significant experiences, and what shaped who you are today.", "word_limit": 800},
    {"question": "Discuss your academic interests and goals.", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Diana wrote compelling narrative about immigrating from war-torn country, learning English, and becoming valedictorian while helping family.',
    'Winner: Andre discussed being first in family to attend college, balancing work and school, and passion for social justice through law.'
  ],
  '{"family_income_max": 65000, "grade_level": ["12th Grade"]}'::jsonb,
  ARRAY['Diversity', 'Financial Need', 'Merit']
),
(
  'UNCF Scholarships',
  'United Negro College Fund',
  'Various scholarships for African American students demonstrating academic promise and leadership potential.',
  'African American students with minimum 2.5 GPA planning to attend HBCU or other accredited institution.',
  10000,
  '2026-05-31',
  '[
    {"question": "Describe your academic goals and how this scholarship will help you achieve them.", "word_limit": 500}
  ]'::jsonb,
  ARRAY[
    'Winner: Tiffany wrote about aspiration to become engineer and give back to African American community through STEM mentorship.',
    'Winner: Jordan discussed education as tool for breaking cycles of poverty and plans to become teacher in underserved schools.'
  ],
  '{"ethnicity": ["African American"], "gpa_min": 2.5}'::jsonb,
  ARRAY['Diversity', 'Merit', 'Leadership']
),
(
  'APIA Scholarship',
  'Asian & Pacific Islander American Scholarship Fund',
  'For Asian and Pacific Islander students who demonstrate community involvement and connection to cultural identity.',
  'Students of Asian or Pacific Islander heritage with minimum 2.7 GPA and demonstrated community service.',
  20000,
  '2026-01-20',
  '[
    {"question": "Discuss your cultural identity and community service involvement. How has your heritage shaped your goals?", "word_limit": 600}
  ]'::jsonb,
  ARRAY[
    'Winner: Linh wrote about Vietnamese heritage, organizing cultural awareness events, and bridging generational gaps in immigrant community.',
    'Winner: Kai discussed Pacific Islander identity, revitalizing traditional practices, and pursuing anthropology to preserve culture.'
  ],
  '{"ethnicity": ["Asian American", "Pacific Islander"], "gpa_min": 2.7}'::jsonb,
  ARRAY['Diversity', 'Community Service', 'Cultural Identity']
);

-- CREATIVE / ARTS SCHOLARSHIPS
INSERT INTO scholarships (title, organization, description, criteria, amount, deadline, essay_prompts, winner_stories, requirements, tags) VALUES
(
  'Scholastic Arts & Writing Awards',
  'Scholastic Inc.',
  'National competition recognizing creative writing and visual art students who demonstrate original creativity and emotional storytelling.',
  'Students in grades 7-12 submitting original creative works in writing or visual arts.',
  10000,
  '2025-12-15',
  '[
    {"question": "Artist statement: Describe your creative vision and what inspired this work.", "word_limit": 300}
  ]'::jsonb,
  ARRAY[
    'Winner: Maya submitted powerful poetry collection about immigrant experience, emphasizing authentic voice and emotional depth.',
    'Winner: Alex created visual art series on climate change, showing technical skill and meaningful social commentary.'
  ],
  '{"grade_level": ["7th-12th Grade"], "field": ["Writing", "Visual Arts"]}'::jsonb,
  ARRAY['Arts', 'Creative', 'Writing']
),
(
  'YoungArts National Arts Competition',
  'National YoungArts Foundation',
  'Competition for students talented in visual arts, music, dance, and writing who demonstrate exceptional skill and artistic discipline.',
  'Students ages 15-18 or grades 10-12 with demonstrated excellence in visual arts, music, dance, theater, writing, or other arts.',
  10000,
  '2025-10-15',
  '[
    {"question": "Describe your artistic intent and creative process behind your submitted work.", "word_limit": 400}
  ]'::jsonb,
  ARRAY[
    'Winner: Sophia submitted classical piano performance showing technical mastery and emotional interpretation.',
    'Winner: Marcus created dance choreography blending traditional and contemporary styles, demonstrating innovation and discipline.'
  ],
  '{"age_range": ["15-18"], "grade_level": ["10th-12th Grade"], "field": ["Visual Arts", "Music", "Dance", "Theater", "Writing"]}'::jsonb,
  ARRAY['Arts', 'Creative', 'Performance']
),
(
  'Doodle for Google Scholarship',
  'Google',
  'K-12 creativity-based competition where students create Google Doodle based on inspirational theme.',
  'K-12 students who create original artwork based on annual theme demonstrating creativity and originality.',
  30000,
  '2026-03-15',
  '[
    {"question": "Short artist statement: What inspired your doodle and what does it represent?", "word_limit": 150}
  ]'::jsonb,
  ARRAY[
    'Winner: Emma created doodle celebrating STEM educators, combining vibrant colors with meaningful symbolism.',
    'Winner: Leo designed doodle honoring environmental heroes, showing creativity and social awareness.'
  ],
  '{"grade_level": ["K-12"]}'::jsonb,
  ARRAY['Arts', 'Creative', 'Innovation']
);
