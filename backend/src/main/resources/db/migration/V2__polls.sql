CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question VARCHAR(240) NOT NULL,
    reward_disclosure VARCHAR(500) NOT NULL DEFAULT 'No rewards are offered for this poll.',
    status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    label VARCHAR(120) NOT NULL,
    position SMALLINT NOT NULL CHECK (position >= 0),
    UNIQUE (poll_id, position),
    UNIQUE (id, poll_id)
);

CREATE TABLE poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL,
    voter_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (poll_id, voter_id),
    FOREIGN KEY (option_id, poll_id) REFERENCES poll_options(id, poll_id)
);

CREATE INDEX idx_polls_status_created ON polls (status, created_at DESC);
CREATE INDEX idx_poll_votes_option ON poll_votes (option_id);
