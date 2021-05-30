var schema = `
CREATE TABLE public.users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username TEXT NOT NULL,
    email character varying(40),
    can_email boolean NOT NULL,
    consented boolean NOT NULL,
    surveyor boolean NOT NULL DEFAULT false,
    admin boolean NOT NULL DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to ${process.env.DB_USER};

CREATE TABLE public.surveys
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    owner_id integer NOT NULL,
    start_date DATE NOT NULL,
    description TEXT NOT NULL,
    public_key TEXT NOT NULL,
    response_email TEXT NOT NULL,
    CONSTRAINT survey_pkey PRIMARY KEY (id),
    CONSTRAINT fk_owner FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
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
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.passwords
    OWNER to ${process.env.DB_USER};

CREATE TABLE public.userssurveys
(
    user_id integer NOT NULL,
    survey_id integer NOT NULL,
    CONSTRAINT usersurveys_pkey PRIMARY KEY(user_id,survey_id),
    CONSTRAINT fk_usersurveys_user FOREIGN KEY(user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_usersyrveys_survey FOREIGN KEY(survey_id)
        REFERENCES public.surveys (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.userssurveys
    OWNER to ${process.env.DB_USER};

CREATE TABLE public.questions
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    survey_id integer NOT NULL,
    text TEXT NOT NULL, 
    CONSTRAINT fk_question_survey_id FOREIGN KEY(survey_id)
        REFERENCES public.surveys (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;


ALTER TABLE public.questions
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
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_survey FOREIGN KEY (survey_id)
        REFERENCES public.surveys (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.answers
    OWNER to ${process.env.DB_USER};

CREATE TABLE public.dataremoval
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT removal_pkey PRIMARY KEY (id),
    CONSTRAINT fk_removal_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;

ALTER TABLE public.dataremoval
    OWNER to ${process.env.DB_USER};
`

export { schema }

