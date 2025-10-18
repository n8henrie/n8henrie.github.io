{
  description = "Reproducible setup for n8henrie.com via GitHub Pages";
  # ruby 3.3.4
  # https://pages.github.com/versions.json
  # https://lazamar.co.uk/nix-versions/?channel=nixpkgs-unstable&package=ruby
  inputs.nixpkgs.url = "github:nixos/nixpkgs/ab7b6889ae9d484eed2876868209e33eb262511d";
  outputs =
    { nixpkgs, ... }:
    let
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
      ];
      eachSystem =
        with nixpkgs.lib;
        f: foldAttrs mergeAttrs { } (map (s: mapAttrs (_: v: { ${s} = v; }) (f s)) systems);
    in
    eachSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        jekyll_ruby = pkgs.ruby_3_3;
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            bundix
            (bundlerEnv {
              ruby = jekyll_ruby;
              name = "n8henrie.com";
              gemdir = ./.;
              gemConfig = {
                nokogiri = attrs: {
                  buildInputs = [ pkgs.zlib ];
                  buildFlags = [
                    "--with-iconv-dir=${libiconv}"
                    "--with-opt-include=${libiconv}/include"
                  ];
                };
                ffi = attrs: {
                  buildInputs = [ pkgs.libffi ];
                };
              };
            })
            pkg-config
            jekyll_ruby
          ];
          shellHook = ''
              export LANG="en_US.UTF-8"
            	trap "kill 0" EXIT
            	bundle exec jekyll clean
            	bundle exec guard -i &
            	DISABLE_WHITELIST=true bundle exec jekyll serve --config _config.yml,_config_dev.yml --incremental --watch --drafts &
            	until [[ "$(curl --silent --write-out "%{http_code}" --output /dev/null http://localhost:4000)" -eq 200 ]]; do
                echo "Waiting for jekyll server..."
                sleep 1
              done
              open "http://localhost:4000"
          '';
        };
      }
    );
}
