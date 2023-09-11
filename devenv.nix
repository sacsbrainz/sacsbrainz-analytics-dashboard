{ pkgs, config, ... }:

{

  enterShell = ''
    if [[ ! -d node_modules ]]; then
        npm install
    fi
  '';

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs-18_x;
  };

  # Start the frontend server
  processes.start-frontend.exec = "npm run dev";
  # See full reference at https://devenv.sh/reference/options/
}
