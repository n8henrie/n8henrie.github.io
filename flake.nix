{
  description = "Reproducible setup for n8henrie.com via GitHub Pages";
  # ruby 3.3.4
  # https://pages.github.com/versions.json
  # https://lazamar.co.uk/nix-versions/?channel=nixpkgs-unstable&package=ruby
  inputs.nixpkgs.url = "github:nixos/nixpkgs/ab7b6889ae9d484eed2876868209e33eb262511d";
  # inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
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
              gemConfig.nokogiri = attrs: {
                buildInputs = [ pkgs.zlib ];
                buildFlags = [
                  "--with-iconv-dir=${libiconv}"
                  "--with-opt-include=${libiconv}/include"
                ];
              };
              gemConfig.ffi = attrs: {
                buildInputs = [ pkgs.libffi ];
              };
            })
            # iconv
            # libffi
            pkg-config
            jekyll_ruby
          ];
          # shellHook = ''
          #   export LANG="en_US.UTF-8"
          #   make develop
          # '';
        };
      }
    );
}
