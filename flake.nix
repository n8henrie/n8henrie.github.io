{
  description = "Reproducible setup for n8henrie.com via GitHub Pages";
  inputs = {
    # ruby 2.7.4
    # https://pages.github.com/versions/
    # https://lazamar.co.uk/nix-versions/?channel=nixpkgs-unstable&package=ruby
    nixpkgs.url = "https://github.com/NixOS/nixpkgs/archive/5e15d5da4abb74f0dd76967044735c70e94c5af1.tar.gz";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
      ];
    in
    {
      devShell = builtins.listToAttrs
        (map
          (system:
            let
              pkgs = import nixpkgs {
                inherit system;
              };
              gems = pkgs.bundlerEnv {
                ruby = pkgs.ruby;
                name = "n8henrie.com";
                gemdir = ./.;

                gemConfig.nokogiri = attrs: {
                  buildInputs = [ pkgs.zlib ];
                };
              };
            in
            {
              name = system;
              value = with pkgs;
                mkShell {
                  buildInputs = [
                    bundix
                    gems
                    libffi
                    pkgconfig
                    ruby
                  ];
                  shellHook = ''
                    export LANG="en_US.UTF-8"
                    make develop
                  '';
                };
            }
          )
          systems);
    };
}
