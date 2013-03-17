# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
  config.vm.box = "precise64-ruby-1.9.3-p194"
  config.vm.box_url = "https://dl.dropbox.com/u/14292474/vagrantboxes/precise64-ruby-1.9.3-p194.box"

  config.vm.network :hostonly, '192.168.10.200'
  config.ssh.forward_agent = true
  config.vm.customize ["modifyvm", :id, "--memory", 1024]
  config.vm.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  config.vm.forward_port 3000, 4000, 9292
  nfs_setting = RUBY_PLATFORM =~ /darwin/ ? true : false
  config.vm.share_folder("v-root", "/vagrant", ".", :nfs => nfs_setting)

  # We need a javascript runtime to build ember.js with rake
  # and phantomjs to execute test suite.
  #
  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "cookbooks"
    chef.add_recipe "build-essential"
    chef.add_recipe "nodejs::install_from_source"
    chef.add_recipe "phantomjs"
    chef.add_recipe "vim"
  end
end
