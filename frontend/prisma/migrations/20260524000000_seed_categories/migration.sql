INSERT INTO "Category" (id, name) VALUES
  (gen_random_uuid()::text, 'Разработка'),
  (gen_random_uuid()::text, 'Дизайн'),
  (gen_random_uuid()::text, 'Бизнес'),
  (gen_random_uuid()::text, 'Маркетинг'),
  (gen_random_uuid()::text, 'Анализ данных'),
  (gen_random_uuid()::text, 'IT и ПО'),
  (gen_random_uuid()::text, 'Финансы'),
  (gen_random_uuid()::text, 'Личное развитие'),
  (gen_random_uuid()::text, 'Фото и видео'),
  (gen_random_uuid()::text, 'Музыка'),
  (gen_random_uuid()::text, 'Здоровье и спорт'),
  (gen_random_uuid()::text, 'Образование')
ON CONFLICT (name) DO NOTHING;
