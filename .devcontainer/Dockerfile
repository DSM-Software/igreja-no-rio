FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

# Install firewall and network tools required by setup-firewall.sh
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       iptables \
       ipset \
       aggregate \
       jq \
       curl \
       dnsutils \
       iproute2 \
       iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI (gh) — required to authenticate for GitHub API meta fetch
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
        | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
        > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends gh \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code globally
RUN npm install -g @anthropic-ai/claude-code

# Copy and register firewall script (runs as root via sudo in postCreateCommand)
COPY setup-firewall.sh /usr/local/bin/setup-firewall.sh
RUN chmod +x /usr/local/bin/setup-firewall.sh \
    && echo "node ALL=(root) NOPASSWD: /usr/local/bin/setup-firewall.sh" \
        > /etc/sudoers.d/firewall \
    && chmod 0440 /etc/sudoers.d/firewall
