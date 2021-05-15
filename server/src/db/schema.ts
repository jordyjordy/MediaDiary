var schema = `
CREATE TABLE public.users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    email character varying(40) COLLATE pg_catalog."default" NOT NULL,
    can_email boolean NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to ${process.env.DB_USER};

CREATE TABLE public.surveys
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    owner_id integer NOT NULL,
    start_date DATE NOT NULL,
    CONSTRAINT survey_pkey PRIMARY KEY (id),
    CONSTRAINT fk_owner FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.surveys
    OWNER to ${process.env.DB_USER};

CREATE TABLE public.passwords
(
    user_id integer NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT passwords_pkey PRIMARY KEY (user_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.passwords
    OWNER to ${process.env.DB_USER};

CREATE TABLE public.answers
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer NOT NULL,
    survey_id integer NOT NULL,
    path VARCHAR(256) NOT NULL,
    answer_date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT answers_pkey PRIMARY KEY (id),
    CONSTRAINT fk_answer_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_survey FOREIGN KEY (survey_id)
        REFERENCES public.surveys (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.answers
    OWNER to ${process.env.DB_USER};
`

export { schema }

